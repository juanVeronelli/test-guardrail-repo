import { Request, Response, NextFunction } from "express";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { db } from "../database";
import escapeHtml from "escape-html";
import { getAdminSecretToken } from "../config.server";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const adminToken = getAdminSecretToken();
  if (!adminToken) {
    return res.status(500).json({ error: "Server configuration error" });
  }
  
  try {
    const tokenBuffer = Buffer.from(token);
    const adminTokenBuffer = Buffer.from(adminToken);
    
    if (tokenBuffer.length !== adminTokenBuffer.length) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const isValid = crypto.timingSafeEqual(tokenBuffer, adminTokenBuffer);
    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export class AdminController {
  public async getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    
    if (!userId || !/^[0-9]+$/.test(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    try {
      const query = "SELECT id, username, email FROM users WHERE id = ?";
      const user = await db.query(query, [userId]);
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  }

  public async pingHost(req: Request, res: Response) {
    const host = req.body.host;
    
    const hostPattern = /^[a-zA-Z0-9.-]+$/;
    if (!host || typeof host !== "string" || !hostPattern.test(host)) {
      return res.status(400).json({ error: "Invalid host format" });
    }
    
    if (host.length > 253) {
      return res.status(400).json({ error: "Host too long" });
    }
    
    execFile("ping", ["-c", "4", host], (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: "Ping failed" });
      }
      return res.json({ result: escapeHtml(stdout) });
    });
  }

  public async downloadReport(req: Request, res: Response) {
    const fileName = req.query.file as string;
    
    if (!fileName || typeof fileName !== "string") {
      return res.status(400).json({ error: "File parameter required" });
    }
    
    const safeName = path.basename(fileName);
    
    const safePattern = /^[a-zA-Z0-9_-]+\.(txt|pdf|csv)$/;
    if (!safePattern.test(safeName)) {
      return res.status(400).json({ error: "Invalid file name" });
    }
    
    const uploadsDir = path.resolve("/var/www/uploads");
    const filePath = path.join(uploadsDir, safeName);
    const resolvedPath = path.resolve(filePath);
    
    if (!resolvedPath.startsWith(uploadsDir + path.sep) && resolvedPath !== uploadsDir) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    try {
      if (!fs.existsSync(resolvedPath)) {
        return res.status(404).json({ error: "File not found" });
      }
      
      const stats = fs.statSync(resolvedPath);
      if (!stats.isFile()) {
        return res.status(400).json({ error: "Not a file" });
      }
      
      const content = fs.readFileSync(resolvedPath, "utf-8");
      return res.json({ content: content });
    } catch (error) {
      return res.status(404).json({ error: "File not found" });
    }
  }

  public async renderUserPage(req: Request, res: Response) {
    const name = req.query.name as string;
    
    const safeName = name ? escapeHtml(String(name)) : "Invitado";
    
    return res.json({
      message: `Bienvenido ${safeName}`,
      name: safeName
    });
  }

  public async authenticateAdmin(req: Request, res: Response) {
    const token = req.headers.authorization;
    
    if (!token || typeof token !== "string") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const adminToken = getAdminSecretToken();
    if (!adminToken) {
      return res.status(500).json({ error: "Server configuration error" });
    }
    
    try {
      const tokenBuffer = Buffer.from(token);
      const adminTokenBuffer = Buffer.from(adminToken);
      
      if (tokenBuffer.length !== adminTokenBuffer.length) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const isValid = crypto.timingSafeEqual(tokenBuffer, adminTokenBuffer);
      
      if (isValid) {
        return res.json({ status: "success", authenticated: true });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
  
  public async getSecureData(req: Request, res: Response) {
    return res.json({ data: "Sensitive admin data" });
  }
}

export { requireAuth };
