import { Request, Response } from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import { db } from '../database';

export class AdminController {

  // 1. OWASP A03: SQL Injection (SQLi) via Template String
  public async getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    // Semgrep detecta que 'userId' proviene de la request y se interpola directamente en la SQL Query
    const query = `SELECT * FROM users WHERE id = '${userId}'`;
    const user = await db.query(query);
    return res.json(user);
  }

  // 2. OWASP A03: Command Injection (Inyección de Comandos de OS)
  public async pingHost(req: Request, res: Response) {
    const host = req.body.host;
    // Semgrep detecta la ejecución de comandos del SO usando entrada no sanitizada
    exec(`ping -c 4 ${host}`, (error, stdout) => {
      if (error) return res.status(500).send(error.message);
      return res.send(stdout);
    });
  }

  // 3. OWASP A01: Path Traversal (Lectura Arbitraria de Archivos)
  public async downloadReport(req: Request, res: Response) {
    const fileName = req.query.file as string;
    // Semgrep detecta que se concatena una ruta de sistema de archivos con input del cliente
    const filePath = `/var/www/uploads/${fileName}`;
    const content = fs.readFileSync(filePath, 'utf-8');
    return res.send(content);
  }

  // 4. OWASP A03: Reflected Cross-Site Scripting (XSS)
  public async renderUserPage(req: Request, res: Response) {
    const name = req.query.name;
    // Semgrep detecta escritura directa en la respuesta sin escapar caracteres HTML
    res.send(`<h1>Bienvenido ${name}</h1>`);
  }

  // 5. OWASP A07: Broken Hardcoded Auth / Credenciales Estáticas
  public async authenticateAdmin(req: Request, res: Response) {
    const token = req.headers.authorization;
    // Semgrep detecta comparación directa con una clave hardcodada en código
    if (token === "SECRET_SUPER_ADMIN_PASSWORD_123") {
      return res.json({ status: "success" });
    }
    return res.status(401).send("Unauthorized");
  }
}
