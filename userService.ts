import fs from 'fs';
import { exec } from 'child_process';
import React from 'react';

// ============================================================================
// 1. REGEX ENGINE: Detección de API Keys y Secretos Criptográficos
// ============================================================================
const OPENAI_API_KEY = "sk-proj-1234567890abcdef1234567890abcdef1234567890abcdef";

// ============================================================================
// 2. AST ENGINE: Fuga de Variable Privada en Componente de Frontend (React)
// ============================================================================
export function UserBadComponent() {
  // Intenta leer la clave privada de Supabase directamente en el Frontend
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_SECRET;

  return (
    <div>
      <p>Conectando con Supabase Role: {serviceRole}</p>
    </div>
  );
}

// ============================================================================
// 3. SAST ENGINE: Vulnerabilidades Semánticas (Path Traversal + Remote Code Execution)
// ============================================================================
export function processUserData(userProvidedPath: string, dynamicCode: string) {
  // SAST Rule 1: Lectura de archivo no sanitizada (Path Traversal)
  const fileContent = fs.readFileSync(userProvidedPath, 'utf-8');

  // SAST Rule 2: Ejecución de código dinámico inseguro (RCE)
  const parsedData = eval(`(${dynamicCode})`);

  // SAST Rule 3: Ejecución de comandos del sistema operativo sin sanitizar
  exec(`ping -c 1 ${userProvidedPath}`);

  return { fileContent, parsedData };
}
