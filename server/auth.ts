import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET ?? '';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '1h';
const authUsername = process.env.AUTH_USERNAME ?? 'admin';
const authPassword = process.env.AUTH_PASSWORD ?? '';
const authPasswordHash = process.env.AUTH_PASSWORD_HASH ?? '';

if (!jwtSecret) {
  throw new Error('JWT_SECRET must be set in the environment.');
}

export interface TokenPayload {
  sub: string;
  role?: string;
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, jwtSecret) as TokenPayload;
  } catch {
    return null;
  }
}

export function createAccessToken(username: string): string {
  return jwt.sign({ sub: username }, jwtSecret, { expiresIn: jwtExpiresIn });
}

export function authenticateUser(username: string, password: string): boolean {
  if (username !== authUsername) {
    return false;
  }

  if (authPasswordHash) {
    return bcrypt.compareSync(password, authPasswordHash);
  }

  return authPassword ? password === authPassword : false;
}
