import type { NextApiRequest, NextApiResponse } from 'next';
import { buildNovelCookie, getNovelToken } from '../../lib/novelAuth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end();
    return;
  }

  const { password } = req.body as { password?: string };
  const correctPassword = process.env.NOVEL_PASSWORD;
  const secret = process.env.COOKIE_SECRET;

  if (!correctPassword || !secret) {
    // Env vars not configured — fail closed
    res.status(500).end();
    return;
  }

  if (!password || password !== correctPassword) {
    res.redirect(302, '/novel?error=1');
    return;
  }

  const token = getNovelToken()!;
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', buildNovelCookie(token, isProd));
  res.redirect(302, '/novel/read');
}
