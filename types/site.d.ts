import type { ReactNode } from 'react';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface BlogPostSummary {
  slug: string;
  title: string;
  date: string;
  description?: string;
  excerpt?: string;
  readingTime?: string;
  articleType: string;
  author?: string | null;
  footNotes?: string;
}

export interface BlogFrontmatter extends Record<string, unknown> {
  title?: string;
  description?: string;
  excerpt?: string;
  author?: string | null;
  date?: string;
  readingTime?: string;
  articleType?: string | null;
  footNotes?: string;
  draft?: boolean;
}

export type PostFileType = 'md' | 'mdx';

export interface BlogPostData extends BlogPostSummary {
  content: string;
  fileType: PostFileType;
}

export interface BlogPathParams {
  params: {
    slug: string;
  };
}

export interface PaginatedPostsResult {
  posts: BlogPostSummary[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
}

export interface BlogIndexProps {
  posts: BlogPostSummary[];
  articleTypes: string[];
}

export interface HomePageProps {
  repos: RepositorySummary[];
}

export interface BlogPostPageProps {
  post: BlogPostSummary;
  mdxSource: MDXRemoteSerializeResult | null;
  paginatedMdxSource: MDXRemoteSerializeResult[];
}

export interface FictionReaderProps {
  post: BlogPostSummary;
  pages?: MDXRemoteSerializeResult[];
  components?: any;
}

export interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export interface RepositorySummary {
  source?: 'github' | 'gitlab';
  id: number | string;
  name: string;
  description?: string | null;
  html_url: string;
  language?: string | null;
  stargazers_count?: number;
  forks_count?: number;
}

export interface ErrorBoundaryProps {
  error?: Error | null;
  onRetry?: (() => void) | null;
}

export interface GitHubReposConfig {
  githubUsername: string;
}

export interface ProjectsSectionProps {
  repos: RepositorySummary[];
}