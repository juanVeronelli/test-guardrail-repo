import { Request, Response } from "express";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { db } from "../database";

// Configuración de servidor - solo se ejecuta en backend
let ADMIN_TOKEN_CACHED: string | null = null;

function getAdminToken(): string {
  if (ADMIN_TOKEN_CACHED === null) {
    ADMIN_TOKEN_CACHED = process.env.ADMIN_SECRET_TOKEN || "";
    if (!ADMIN_TOKEN_CACHED) {
      throw new Error("ADMIN_SECRET_TOKEN not configured");
    }
  }
  return ADMIN_TOKEN_CACHED;
}

// Middleware de autenticación
function requireAuth(req: Request, res: Response, next: Function) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const validToken = getAdminToken();
    const tokenBuffer = Buffer.from(token);
    const validTokenBuffer = Buffer.from(validToken);
    
    if (tokenBuffer.length !== validTokenBuffer.length) {
      return res.status(401).send("Unauthorized");
    }

    if (crypto.timingSafeEqual(tokenBuffer, validTokenBuffer)) {
      return next();
    }
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
  
  return res.status(401).send("Unauthorized");
}

export class AdminController {
  // 1. REMEDIADO: SQL Injection - usando consultas parametrizadas
  public async getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    const query = "SELECT * FROM users WHERE id = ?";
    const user = await db.query(query, [userId]);
    return res.json(user);
  }

  // 2. REMEDIADO: Command Injection - validación estricta y execFile
  public async pingHost(req: Request, res: Response) {
    const host = req.body.host;
    
    const validHostPattern = /^[a-zA-Z0-9.-]+$/;
    if (!host || !validHostPattern.test(host)) {
      return res.status(400).send("Invalid host format");
    }

    execFile("ping", ["-c", "4", host], (error, stdout) => {
      if (error) return res.status(500).send("Ping failed");
      return res.send(stdout);
    });
  }

  // 3. REMEDIADO: Path Traversal - validación completa de ruta con realpath
  public async downloadReport(req: Request, res: Response) {
    const fileName = req.query.file as string;
    
    if (!fileName) {
      return res.status(400).send("File name required");
    }

    const allowedFiles = ["report1.pdf", "report2.pdf", "summary.txt"];
    const sanitizedFileName = path.basename(fileName);
    
    if (!allowedFiles.includes(sanitizedFileName)) {
      return res.status(403).send("Access denied");
    }

    const uploadsDir = path.resolve("/var/www/uploads");
    const requestedPath = path.join(uploadsDir, sanitizedFileName);
    
    try {
      const realPath = fs.realpathSync(requestedPath);
      const realUploadsDir = fs.realpathSync(uploadsDir);
      
      if (!realPath.startsWith(realUploadsDir + path.sep)) {
        return res.status(403).send("Access denied");
      }

      const content = fs.readFileSync(realPath, "utf-8");
      return res.send(content);
    } catch (error) {
      return res.status(404).send("File not found");
    }
  }

  // 4. REMEDIADO: XSS + UNAUTHENTICATED_API_ROUTE - escapando HTML y requiriendo auth
  public async renderUserPage(req: Request, res: Response) {
    requireAuth(req, res, () => {
      const name = req.query.name as string;
      
      const escapeHtml = (unsafe: string): string => {
        if (!unsafe) return "";
        return unsafe
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/\//g, "&#x2F;");
      };

      const safeName = escapeHtml(name || "Guest");
      const safeHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><h1>Bienvenido ${safeName}</h1></body></html>`;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.send(safeHtml);
    });
  }

  // 5. REMEDIADO: Timing Attack + CLIENT_SIDE_ENV_LEAK - usando timingSafeEqual y función de servidor
  public async authenticateAdmin(req: Request, res: Response) {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const validToken = getAdminToken();
      const tokenBuffer = Buffer.from(token);
      const validTokenBuffer = Buffer.from(validToken);
      
      if (tokenBuffer.length !== validTokenBuffer.length) {
        return res.status(401).send("Unauthorized");
      }

      if (crypto.timingSafeEqual(tokenBuffer, validTokenBuffer)) {
        return res.json({ status: "success" });
      }
    } catch (error) {
      return res.status(401).send("Unauthorized");
    }
    
    return res.status(401).send("Unauthorized");
  }
}
