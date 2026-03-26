import { describe, it, expect } from 'vitest';
import { normalizeArticleType, getArticleTypeLabel } from '../../lib/articleTypes';

describe('normalizeArticleType', () => {
  it('returns "article" for undefined input', () => {
    expect(normalizeArticleType(undefined)).toBe('article');
  });

  it('returns "article" for null input', () => {
    expect(normalizeArticleType(null)).toBe('article');
  });

  it('returns "article" for empty string', () => {
    expect(normalizeArticleType('')).toBe('article');
  });

  it('returns "article" for whitespace-only string', () => {
    expect(normalizeArticleType('   ')).toBe('article');
  });

  it('lowercases and trims input', () => {
    expect(normalizeArticleType('  Fiction  ')).toBe('fiction');
  });

  it('replaces spaces and underscores with hyphens', () => {
    expect(normalizeArticleType('short story')).toBe('short-story');
    expect(normalizeArticleType('short_story')).toBe('short-story');
  });

  it('passes through already-normalized values', () => {
    expect(normalizeArticleType('article')).toBe('article');
    expect(normalizeArticleType('fiction')).toBe('fiction');
  });
});

describe('getArticleTypeLabel', () => {
  it('returns "Articles" for article type', () => {
    expect(getArticleTypeLabel('article')).toBe('Articles');
  });

  it('returns "Digital Fiction" for fiction type', () => {
    expect(getArticleTypeLabel('fiction')).toBe('Digital Fiction');
  });

  it('returns "Articles" for undefined/null', () => {
    expect(getArticleTypeLabel(undefined)).toBe('Articles');
    expect(getArticleTypeLabel(null)).toBe('Articles');
  });

  it('title-cases unknown article types with hyphens', () => {
    expect(getArticleTypeLabel('short-story')).toBe('Short Story');
  });

  it('handles case-insensitive input', () => {
    expect(getArticleTypeLabel('FICTION')).toBe('Digital Fiction');
    expect(getArticleTypeLabel('Article')).toBe('Articles');
  });
});
