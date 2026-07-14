import * as argon2 from 'argon2';
import { randomBytes, createHash } from 'crypto';
import { prisma } from './db';
import { cookies } from 'next/headers';
import type { Role } from '@prisma/client';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

const ARGON2_OPTIONS: argon2.Options & { raw?: false } = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  hashLength: 32,
};

const SESSION_CONFIG = {
  cookieName: process.env.SESSION_COOKIE_NAME || 'sudofim_session',
  maxAge: parseInt(process.env.SESSION_MAX_AGE || '604800', 10),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export async function createSession(userId: string, ip: string, userAgent: string): Promise<string> {
  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_CONFIG.maxAge * 1000);

  await prisma.session.create({
    data: { token: tokenHash, userId, ip: ip || null, userAgent: userAgent || null, expiresAt },
  });

  return token;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_CONFIG.cookieName, token, {
    httpOnly: SESSION_CONFIG.httpOnly,
    secure: SESSION_CONFIG.secure,
    sameSite: SESSION_CONFIG.sameSite,
    path: SESSION_CONFIG.path,
    maxAge: SESSION_CONFIG.maxAge,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_CONFIG.cookieName, '', {
    httpOnly: SESSION_CONFIG.httpOnly,
    secure: SESSION_CONFIG.secure,
    sameSite: SESSION_CONFIG.sameSite,
    path: SESSION_CONFIG.path,
    maxAge: 0,
  });
}

export async function getSession(): Promise<{
  user: { id: string; email: string; firstName: string; lastName: string; phone: string | null; role: Role; createdAt: Date; updatedAt: Date };
  session: { id: string; token: string; userId: string; ip: string | null; userAgent: string | null; expiresAt: Date; createdAt: Date };
} | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_CONFIG.cookieName);
    if (!sessionCookie?.value) return null;

    const tokenHash = hashToken(sessionCookie.value);
    const session = await prisma.session.findUnique({
      where: { token: tokenHash },
      include: { user: true },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      try {
        const cs = await cookies();
        cs.set(SESSION_CONFIG.cookieName, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
      } catch { /* can't set cookies in some contexts */ }
      return null;
    }

    return {
      user: session.user,
      session: { id: session.id, token: session.token, userId: session.userId, ip: session.ip, userAgent: session.userAgent, expiresAt: session.expiresAt, createdAt: session.createdAt },
    };
  } catch {
    return null;
  }
}

export async function invalidateSession(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await prisma.session.delete({ where: { token: tokenHash } }).catch(() => {});
}

export async function cleanupExpiredSessions(): Promise<void> {
  await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
}
