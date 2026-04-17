import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const ivSize = 12;
const keySize = 32;

function getEncryptionKey(): Buffer {
  const rawKey = process.env.ENCRYPTION_KEY;
  if (!rawKey) {
    throw new Error('ENCRYPTION_KEY is required for data encryption.');
  }

  const keyBuffer = Buffer.from(rawKey, 'base64');
  if (keyBuffer.length !== keySize) {
    throw new Error(`ENCRYPTION_KEY must be base64 and ${keySize} bytes after decode.`);
  }

  return keyBuffer;
}

export function encryptText(value: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(ivSize);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decryptText(value: string): string {
  const key = getEncryptionKey();
  const data = Buffer.from(value, 'base64');
  const iv = data.slice(0, ivSize);
  const tag = data.slice(ivSize, ivSize + 16);
  const encrypted = data.slice(ivSize + 16);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

function getPathValue(source: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: any, part) => (current && typeof current === 'object' ? current[part] : undefined), source);
}

function setPathValue(target: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let current: any = target;

  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
}

export function encryptFields<T extends Record<string, unknown>>(payload: T, paths: string[]): T {
  const copy = JSON.parse(JSON.stringify(payload)) as T;

  for (const path of paths) {
    const rawValue = getPathValue(copy, path);
    if (typeof rawValue === 'string' && rawValue.length > 0) {
      setPathValue(copy, path, encryptText(rawValue));
    }
  }

  return copy;
}

export function decryptFields<T extends Record<string, unknown>>(payload: T, paths: string[]): T {
  const copy = JSON.parse(JSON.stringify(payload)) as T;

  for (const path of paths) {
    const rawValue = getPathValue(copy, path);
    if (typeof rawValue === 'string' && rawValue.length > 0) {
      try {
        setPathValue(copy, path, decryptText(rawValue));
      } catch {
        // If decryption fails, keep the existing value to avoid crashing on non-encrypted content.
      }
    }
  }

  return copy;
}
