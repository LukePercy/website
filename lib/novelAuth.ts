import { createHmac } from 'crypto';

export const NOVEL_COOKIE_NAME = 'novel_access';
export const NOVEL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getNovelToken(): string | null {
  const password = process.env.NOVEL_PASSWORD;
  const secret = process.env.COOKIE_SECRET;
  if (!password || !secret) return null;
  return createHmac('sha256', secret).update(password).digest('hex');
}

export function isValidNovelCookie(cookieValue: string | undefined): boolean {
  const validToken = getNovelToken();
  if (!validToken || !cookieValue) return false;
  return cookieValue === validToken;
}

export function buildNovelCookie(token: string, isProd: boolean): string {
  const secure = isProd ? '; Secure' : '';
  return `${NOVEL_COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Path=/novel; Max-Age=${NOVEL_COOKIE_MAX_AGE}${secure}`;
}
