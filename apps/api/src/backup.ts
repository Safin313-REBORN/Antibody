import path from 'path';
import fs from 'fs';
import { db } from './db.js';

export async function runDatabaseBackup(): Promise<string> {
  const backupDir = path.join(process.cwd(), 'data', 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const targetPath = path.join(backupDir, `antibody-backup-${stamp}.sqlite`);
  await db.backup(targetPath);
  return targetPath;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runDatabaseBackup()
    .then((p) => {
      console.log(`Database backup created at: ${p}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Backup failed:', err);
      process.exit(1);
    });
}
