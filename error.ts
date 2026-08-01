import { Request, Response } from "express";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { db } from "../database";

export class AdminController {
  // 1. REMEDIADO: SQL Injection - usando consultas parametrizadas
  public async getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    // Se usa consulta parametrizada en lugar de interpolación directa
    const query = "SELECT * FROM users WHERE id = ?";
    const user = await db.query(query, [userId]);
    return res.json(user);
  }

  // 2. REMEDIADO: Command Injection - validación estricta y execFile
  public async pingHost(req: Request, res: Response) {
    const host = req.body.host;
    
    // Whitelist de hosts permitidos o validación estricta de formato
    const validHostPattern = /^[a-zA-Z0-9.-]+$/;
    if (!host || !validHostPattern.test(host)) {
      return res.status(400).send("Invalid host format");
    }

    // Usar execFile en lugar de exec y pasar argumentos como array
    execFile("ping", ["-c", "4", host], (error, stdout) => {
      if (error) return res.status(500).send("Ping failed");
      return res.send(stdout);
    });
  }

  // 3. REMEDIADO: Path Traversal - validación de ruta y path.basename
  public async downloadReport(req: Request, res: Response) {
    const fileName = req.query.file as string;
    
    if (!fileName) {
      return res.status(400).send("File name required");
    }

    // Whitelist de archivos permitidos
    const allowedFiles = ["report1.pdf", "report2.pdf", "summary.txt"];
    const sanitizedFileName = path.basename(fileName);
    
    if (!allowedFiles.includes(sanitizedFileName)) {
      return res.status(403).send("Access denied");
    }

    const uploadsDir = "/var/www/uploads";
    const filePath = path.join(uploadsDir, sanitizedFileName);
    
    // Verificar que la ruta resultante está dentro del directorio permitido
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(403).send("Access denied");
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return res.send(content);
    } catch (error) {
      return res.status(404).send("File not found");
    }
  }

  // 4. REMEDIADO: XSS - escapando HTML antes de renderizar
  public async renderUserPage(req: Request, res: Response) {
    const name = req.query.name as string;
    
    // Función para escapar caracteres HTML peligrosos
    const escapeHtml = (unsafe: string): string => {
      if (!unsafe) return "";
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const safeName = escapeHtml(name || "Guest");
    res.send(`<h1>Bienvenido ${safeName}</h1>`);
  }

  // 5. REMEDIADO: Timing Attack + Hardcoded Credentials - usando timingSafeEqual y variables de entorno
  public async authenticateAdmin(req: Request, res: Response) {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    // Usar variable de entorno en lugar de credencial hardcodeada
    const validToken = process.env.ADMIN_SECRET_TOKEN || "";
    
    if (!validToken) {
      return res.status(500).send("Server configuration error");
    }

    // Comparación segura contra timing attacks usando crypto.timingSafeEqual
    const tokenBuffer = Buffer.from(token);
    const validTokenBuffer = Buffer.from(validToken);
    
    // Asegurar que ambos buffers tengan la misma longitud para timingSafeEqual
    if (tokenBuffer.length !== validTokenBuffer.length) {
      return res.status(401).send("Unauthorized");
    }

    try {
      if (crypto.timingSafeEqual(tokenBuffer, validTokenBuffer)) {
        return res.json({ status: "success" });
      }
    } catch (error) {
      return res.status(401).send("Unauthorized");
    }
    
    return res.status(401).send("Unauthorized");
  }
}
