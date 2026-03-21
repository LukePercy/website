import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { normalizeArticleType } from './articleTypes';
import type {
  BlogFrontmatter,
  BlogPathParams,
  BlogPostData,
  BlogPostSummary,
  PaginatedPostsResult,
  PostFileType,
} from '../types/site';

const postsDirectory = path.join(process.cwd(), 'content/blog');
const PAGE_BREAK_PATTERN = /\r?\n\s*---\s*\r?\n/g;

function stripMarkdown(content: string): string {
  return content
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateReadingTime(content: string): string {
  const plainText = stripMarkdown(content);
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

function getReadingTime(data: BlogFrontmatter, content: string): string {
  return data.readingTime || calculateReadingTime(content);
}

function toPostSummary(slug: string, data: BlogFrontmatter, content: string): BlogPostSummary {
  return {
    slug,
    title: typeof data.title === 'string' ? data.title : slug,
    date: typeof data.date === 'string' ? data.date : '',
    description: typeof data.description === 'string' ? data.description : '',
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
    author: typeof data.author === 'string' ? data.author : null,
    footNotes: typeof data.footNotes === 'string' ? data.footNotes : '',
    articleType: normalizeArticleType(data.articleType),
    readingTime: getReadingTime(data, content),
  };
}

function parseFrontmatter(source: string): { data: BlogFrontmatter; content: string } {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: source };
  }

  const [, frontmatterRaw, content] = match;
  const data = (YAML.parse(frontmatterRaw) ?? {}) as BlogFrontmatter;
  return { data, content };
}

export function getPostContentPages(content: string): string[] {
  const pages = content
    .split(PAGE_BREAK_PATTERN)
    .map((page) => page.trim())
    .filter(Boolean);

  return pages.length > 0 ? pages : [content.trim()];
}

export function getSortedPostsData(): BlogPostSummary[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(mdx|md)$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = parseFrontmatter(fileContents);

      if (data.draft) {
        return null;
      }

      return toPostSummary(slug, data, content);
    })
    .filter((post): post is BlogPostSummary => Boolean(post));

  return allPostsData.sort((left, right) => {
    if (left.date < right.date) {
      return 1;
    }

    return -1;
  });
}

export function getAllPostSlugs(): BlogPathParams[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(mdx|md)$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = parseFrontmatter(fileContents);

      if (data.draft) {
        return null;
      }

      return {
        params: {
          slug,
        },
      };
    })
    .filter((post): post is BlogPathParams => Boolean(post));
}

export async function getPostData(slug: string): Promise<BlogPostData> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  let fileContents: string;
  let fileType: PostFileType = 'mdx';

  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch {
    const mdPath = path.join(postsDirectory, `${slug}.md`);
    fileContents = fs.readFileSync(mdPath, 'utf8');
    fileType = 'md';
  }

  const { data, content } = parseFrontmatter(fileContents);

  return {
    ...toPostSummary(slug, data, content),
    content,
    fileType,
  };
}

export function getPaginatedPosts(page = 1, postsPerPage = 10): PaginatedPostsResult {
  const allPosts = getSortedPostsData();
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  return {
    posts: allPosts.slice(startIndex, endIndex),
    totalPages,
    currentPage: page,
    totalPosts: allPosts.length,
  };
}