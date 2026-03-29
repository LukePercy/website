import { readFileSync } from 'fs';
import { join } from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidNovelCookie, NOVEL_COOKIE_NAME } from '../../../lib/novelAuth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.cookies[NOVEL_COOKIE_NAME];
  if (!isValidNovelCookie(cookie)) {
    res.redirect(302, '/novel');
    return;
  }

  const filePath = join(process.cwd(), 'content', 'novel', 'hunter-of-the-strait.html');
  const html = readFileSync(filePath, 'utf8');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'private, no-store');
  res.status(200).send(html);
}
