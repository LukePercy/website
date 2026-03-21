const DEFAULT_ARTICLE_TYPE = 'article';

export function normalizeArticleType(articleType?: string | null): string {
  if (typeof articleType !== 'string') {
    return DEFAULT_ARTICLE_TYPE;
  }

  const normalized = articleType
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-');

  return normalized || DEFAULT_ARTICLE_TYPE;
}

export function getArticleTypeLabel(articleType?: string | null): string {
  const normalized = normalizeArticleType(articleType);

  if (normalized === 'fiction') {
    return 'Digital Fiction';
  }

  if (normalized === 'article') {
    return 'Articles';
  }

  return normalized
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}