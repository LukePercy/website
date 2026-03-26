import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getSiteUrl, getLocalizedPath, getAbsoluteUrl, DEFAULT_SITE_URL } from '../../lib/site';

describe('getSiteUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns default site URL when env var is not set', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getSiteUrl()).toBe(DEFAULT_SITE_URL);
  });

  it('returns env var value when set', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://custom.example.com';
    expect(getSiteUrl()).toBe('https://custom.example.com');
  });

  it('strips trailing slash from env var', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://custom.example.com/';
    expect(getSiteUrl()).toBe('https://custom.example.com');
  });
});

describe('getLocalizedPath', () => {
  it('returns path unchanged when no locale is provided', () => {
    expect(getLocalizedPath('/blog')).toBe('/blog');
  });

  it('prepends locale to path', () => {
    expect(getLocalizedPath('/blog', 'en')).toBe('/en/blog');
  });

  it('handles null locale', () => {
    expect(getLocalizedPath('/about', null)).toBe('/about');
  });

  it('adds leading slash when path does not start with one', () => {
    expect(getLocalizedPath('blog')).toBe('/blog');
  });
});

describe('getAbsoluteUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('combines site URL with path', () => {
    expect(getAbsoluteUrl('/blog')).toBe(`${DEFAULT_SITE_URL}/blog`);
  });

  it('combines site URL with localized path', () => {
    expect(getAbsoluteUrl('/blog', 'en')).toBe(`${DEFAULT_SITE_URL}/en/blog`);
  });
});
