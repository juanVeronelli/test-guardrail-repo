import fs from 'fs';
import { exec } from 'child_process';

export function readUserFile(userInputPath: string) {
  // 🚨 VULNERABILIDAD SAST 1: Path Traversal (leer archivos del sistema)
  const data = fs.readFileSync(userInputPath, 'utf8');

  // 🚨 VULNERABILIDAD SAST 2: Remote Code Execution via eval
  const parsed = eval(`(${data})`);

  // 🚨 VULNERABILIDAD SAST 3: Exec de consola sin sanitizar
  exec(`ping ${userInputPath}`);

  return parsed;
}
