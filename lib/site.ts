export const DEFAULT_SITE_URL = 'https://ljpercy.com';
export const PERSON_NAME = 'Luke Percy';
export const CONTACT_EMAIL = 'lpercy@ljpercy.com';
export const PERSON_SAME_AS = [
  'https://github.com/lukepercy',
  'https://linkedin.com/in/lukepercy',
  'https://www.amazon.com/stores/Luke-Percy/author/B092TDRNYC',
] as const;

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
}

export function getLocalizedPath(path: string, locale?: string | null): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const localePrefix = locale ? `/${locale}` : '';
  return `${localePrefix}${normalizedPath}`;
}

export function getAbsoluteUrl(path: string, locale?: string | null): string {
  return `${getSiteUrl()}${getLocalizedPath(path, locale)}`;
}