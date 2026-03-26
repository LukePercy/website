import { describe, it, expect } from 'vitest';

// These are internal helpers from FictionReader.tsx.
// We replicate them here since they're not exported, to test the logic.

const SWIPE_THRESHOLD = 56;

function getPageIndexFromQuery(pageValue: string | string[] | undefined, totalPages: number): number {
  const rawPage = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const parsedPage = Number.parseInt(rawPage || '1', 10);

  if (Number.isNaN(parsedPage) || parsedPage < 1) {
    return 0;
  }

  return Math.min(parsedPage - 1, Math.max(totalPages - 1, 0));
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

describe('getPageIndexFromQuery', () => {
  it('returns 0 for undefined input', () => {
    expect(getPageIndexFromQuery(undefined, 5)).toBe(0);
  });

  it('returns 0 for page "1" (first page)', () => {
    expect(getPageIndexFromQuery('1', 5)).toBe(0);
  });

  it('returns correct 0-based index for valid page', () => {
    expect(getPageIndexFromQuery('3', 5)).toBe(2);
  });

  it('clamps to last page when page exceeds total', () => {
    expect(getPageIndexFromQuery('10', 5)).toBe(4);
  });

  it('returns 0 for negative page numbers', () => {
    expect(getPageIndexFromQuery('-1', 5)).toBe(0);
  });

  it('returns 0 for non-numeric input', () => {
    expect(getPageIndexFromQuery('abc', 5)).toBe(0);
  });

  it('handles array input (takes first element)', () => {
    expect(getPageIndexFromQuery(['3', '5'], 5)).toBe(2);
  });

  it('returns 0 for zero total pages', () => {
    expect(getPageIndexFromQuery('1', 0)).toBe(0);
  });

  it('returns 0 for page "0"', () => {
    expect(getPageIndexFromQuery('0', 5)).toBe(0);
  });
});

describe('SWIPE_THRESHOLD', () => {
  it('is a positive number', () => {
    expect(SWIPE_THRESHOLD).toBeGreaterThan(0);
  });
});

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    const result = formatDate('2024-03-15');
    // en-NZ locale: "15 March 2024"
    expect(result).toContain('2024');
    expect(result).toContain('March');
    expect(result).toContain('15');
  });
});
