import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';

// Mock fs before importing the module under test
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  },
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
}));

import fs from 'fs';
import {
  getPostContentPages,
  getSortedPostsData,
  getAllPostSlugs,
  getPostData,
  getPaginatedPosts,
} from '../../lib/blog';

// --- getPostContentPages ---

describe('getPostContentPages', () => {
  it('returns a single page when no page breaks exist', () => {
    const content = 'Hello world\n\nThis is a story.';
    const pages = getPostContentPages(content);
    expect(pages).toHaveLength(1);
    expect(pages[0]).toBe(content.trim());
  });

  it('splits on standalone --- lines', () => {
    const content = 'Page one content\n\n---\n\nPage two content\n\n---\n\nPage three';
    const pages = getPostContentPages(content);
    expect(pages).toHaveLength(3);
    expect(pages[0]).toBe('Page one content');
    expect(pages[1]).toBe('Page two content');
    expect(pages[2]).toBe('Page three');
  });

  it('handles Windows-style line endings', () => {
    const content = 'Page one\r\n\r\n---\r\n\r\nPage two';
    const pages = getPostContentPages(content);
    expect(pages).toHaveLength(2);
  });

  it('filters out empty pages from consecutive breaks', () => {
    const content = 'Page one\n\n---\n\n---\n\nPage two';
    const pages = getPostContentPages(content);
    // Empty segments between consecutive breaks are filtered
    expect(pages.every((p) => p.length > 0)).toBe(true);
  });

  it('returns the original content if splitting yields nothing', () => {
    const content = '';
    const pages = getPostContentPages(content);
    // Empty string after trim+filter => falls back to [content.trim()]
    expect(pages).toHaveLength(1);
    expect(pages[0]).toBe('');
  });
});

// --- getSortedPostsData ---

describe('getSortedPostsData', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns empty array when posts directory does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getSortedPostsData()).toEqual([]);
  });

  it('reads .mdx and .md files and returns sorted summaries', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      'older-post.mdx',
      'newer-post.mdx',
      'readme.txt', // should be ignored
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      const p = String(filePath);
      if (p.includes('older-post')) {
        return '---\ntitle: "Older post"\ndate: "2023-01-01"\nexcerpt: "An older post"\n---\nContent here.';
      }
      if (p.includes('newer-post')) {
        return '---\ntitle: "Newer post"\ndate: "2024-06-15"\nexcerpt: "A newer post"\n---\nContent here too.';
      }
      return '';
    });

    const posts = getSortedPostsData();
    expect(posts).toHaveLength(2);
    // Newest first
    expect(posts[0].slug).toBe('newer-post');
    expect(posts[1].slug).toBe('older-post');
  });

  it('excludes draft posts', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      'published.mdx',
      'draft.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      const p = String(filePath);
      if (p.includes('published')) {
        return '---\ntitle: "Published"\ndate: "2024-01-01"\n---\nContent.';
      }
      if (p.includes('draft')) {
        return '---\ntitle: "Draft"\ndate: "2024-01-01"\ndraft: true\n---\nDraft content.';
      }
      return '';
    });

    const posts = getSortedPostsData();
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe('published');
  });

  it('uses slug as title fallback when title is missing', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      'no-title.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    vi.mocked(fs.readFileSync).mockReturnValue('---\ndate: "2024-01-01"\n---\nContent.');

    const posts = getSortedPostsData();
    expect(posts[0].title).toBe('no-title');
  });

  it('calculates reading time at 200 wpm when not supplied', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      'long-post.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    // ~400 words => 2 min read
    const words = Array(400).fill('word').join(' ');
    vi.mocked(fs.readFileSync).mockReturnValue(
      `---\ntitle: "Long post"\ndate: "2024-01-01"\n---\n${words}`,
    );

    const posts = getSortedPostsData();
    expect(posts[0].readingTime).toBe('2 min read');
  });

  it('uses frontmatter readingTime when provided', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      'custom-time.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    vi.mocked(fs.readFileSync).mockReturnValue(
      '---\ntitle: "Custom"\ndate: "2024-01-01"\nreadingTime: "5 min read"\n---\nShort.',
    );

    const posts = getSortedPostsData();
    expect(posts[0].readingTime).toBe('5 min read');
  });

  it('normalizes articleType to lowercase', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      'fiction-post.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    vi.mocked(fs.readFileSync).mockReturnValue(
      '---\ntitle: "Story"\ndate: "2024-01-01"\narticleType: "Fiction"\n---\nOnce upon a time.',
    );

    const posts = getSortedPostsData();
    expect(posts[0].articleType).toBe('fiction');
  });
});

// --- getAllPostSlugs ---

describe('getAllPostSlugs', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns empty array when directory does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getAllPostSlugs()).toEqual([]);
  });

  it('returns params objects for non-draft posts', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue([
      'post-one.mdx',
      'post-two.md',
      'draft-post.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      const p = String(filePath);
      if (p.includes('draft-post')) {
        return '---\ntitle: "Draft"\ndate: "2024-01-01"\ndraft: true\n---\n';
      }
      return '---\ntitle: "Post"\ndate: "2024-01-01"\n---\nContent.';
    });

    const slugs = getAllPostSlugs();
    expect(slugs).toHaveLength(2);
    expect(slugs).toEqual([
      { params: { slug: 'post-one' } },
      { params: { slug: 'post-two' } },
    ]);
  });
});

// --- getPostData ---

describe('getPostData', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('reads .mdx file first, falls back to .md', async () => {
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      const p = String(filePath);
      if (p.endsWith('.mdx')) {
        throw new Error('File not found');
      }
      return '---\ntitle: "Markdown post"\ndate: "2024-01-01"\n---\nMD content.';
    });

    const post = await getPostData('my-post');
    expect(post.fileType).toBe('md');
    expect(post.title).toBe('Markdown post');
  });

  it('returns content and parsed frontmatter', async () => {
    vi.mocked(fs.readFileSync).mockReturnValue(
      '---\ntitle: "Test"\ndate: "2024-03-15"\ndescription: "A test post"\nexcerpt: "Short"\n---\nBody content here.',
    );

    const post = await getPostData('test');
    expect(post.slug).toBe('test');
    expect(post.title).toBe('Test');
    expect(post.date).toBe('2024-03-15');
    expect(post.description).toBe('A test post');
    expect(post.excerpt).toBe('Short');
    expect(post.content).toBe('Body content here.');
    expect(post.fileType).toBe('mdx');
  });
});

// --- getPaginatedPosts ---

describe('getPaginatedPosts', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(fs.existsSync).mockReturnValue(true);

    // Create 15 posts for pagination testing
    const files = Array.from({ length: 15 }, (_, i) =>
      `post-${String(i + 1).padStart(2, '0')}.mdx`,
    );
    vi.mocked(fs.readdirSync).mockReturnValue(files as unknown as ReturnType<typeof fs.readdirSync>);

    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      const p = String(filePath);
      const match = p.match(/post-(\d+)/);
      const num = match ? parseInt(match[1], 10) : 1;
      // Dates spread across 2024 so sorting is deterministic
      const month = String(num).padStart(2, '0');
      return `---\ntitle: "Post ${num}"\ndate: "2024-${month}-01"\n---\nContent ${num}.`;
    });
  });

  it('returns correct page of posts', () => {
    const result = getPaginatedPosts(1, 10);
    expect(result.posts).toHaveLength(10);
    expect(result.totalPages).toBe(2);
    expect(result.currentPage).toBe(1);
    expect(result.totalPosts).toBe(15);
  });

  it('returns remaining posts on last page', () => {
    const result = getPaginatedPosts(2, 10);
    expect(result.posts).toHaveLength(5);
    expect(result.currentPage).toBe(2);
  });

  it('defaults to page 1 with 10 posts per page', () => {
    const result = getPaginatedPosts();
    expect(result.currentPage).toBe(1);
    expect(result.posts.length).toBeLessThanOrEqual(10);
  });
});
