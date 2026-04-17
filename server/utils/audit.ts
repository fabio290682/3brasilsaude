import fs from 'fs';
import path from 'path';

const logDirectory = path.resolve('server', 'logs');
const logFile = path.join(logDirectory, 'audit.log');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

export interface AuditEntry {
  timestamp: string;
  ip: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  user?: string;
  bodyKeys?: string[];
  queryKeys?: string[];
  message?: string;
}

export function logAudit(entry: AuditEntry) {
  const record = JSON.stringify(entry);
  fs.appendFile(logFile, `${record}\n`, (error) => {
    if (error) {
      // Logging should not interrupt normal request processing.
      // eslint-disable-next-line no-console
      console.error('Unable to write audit log:', error);
    }
  });
}

export function maskKeys(source: Record<string, unknown> = {}): string[] {
  return Object.keys(source).filter((key) => key !== 'password' && key !== 'token' && key !== 'apiKey');
}
