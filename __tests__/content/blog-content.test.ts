import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

function getBlogFiles(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
}

function parseFrontmatter(source: string): Record<string, unknown> {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  return (YAML.parse(match[1]) ?? {}) as Record<string, unknown>;
}

describe('blog content validation', () => {
  const files = getBlogFiles();

  it('has at least one blog post', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  describe.each(files)('%s', (fileName) => {
    const filePath = path.join(BLOG_DIR, fileName);
    const raw = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseFrontmatter(raw);

    it('starts with frontmatter fence on line 1', () => {
      expect(raw.startsWith('---')).toBe(true);
    });

    it('has a title field', () => {
      expect(frontmatter.title).toBeDefined();
      expect(typeof frontmatter.title).toBe('string');
      expect((frontmatter.title as string).length).toBeGreaterThan(0);
    });

    it('has a date field in YYYY-MM-DD format', () => {
      expect(frontmatter.date).toBeDefined();
      expect(typeof frontmatter.date).toBe('string');
      expect(frontmatter.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('date is a valid calendar date', () => {
      const date = new Date(frontmatter.date as string);
      expect(date.toString()).not.toBe('Invalid Date');
    });

    it('has an excerpt or description for SEO', () => {
      const hasExcerpt = typeof frontmatter.excerpt === 'string' && frontmatter.excerpt.length > 0;
      const hasDescription = typeof frontmatter.description === 'string' && frontmatter.description.length > 0;
      expect(hasExcerpt || hasDescription).toBe(true);
    });

    it('articleType is a valid value when present', () => {
      if (frontmatter.articleType === undefined) return;
      const validTypes = ['article', 'fiction'];
      const normalized = String(frontmatter.articleType).trim().toLowerCase();
      expect(validTypes).toContain(normalized);
    });

    it('fiction posts use standalone --- as page breaks', () => {
      const type = frontmatter.articleType;
      if (type !== 'fiction') return;

      // Fiction posts should have at least one page break
      const contentOnly = raw.replace(/^---[\s\S]*?---\s*/, '');
      const hasPageBreak = /\n\s*---\s*\n/.test(contentOnly);
      expect(hasPageBreak).toBe(true);
    });

    it('draft field is boolean when present', () => {
      if (frontmatter.draft === undefined) return;
      expect(typeof frontmatter.draft).toBe('boolean');
    });
  });
});
