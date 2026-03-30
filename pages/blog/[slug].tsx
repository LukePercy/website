import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import FictionReader from '../../components/FictionReader';
import ConversationSummaryEmbed from '../../components/ConversationSummaryEmbed';
import TableOfContents from '../../components/TableOfContents';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { getAllPostSlugs, getPostContentPages, getPostData } from '../../lib/blog';
import { getAbsoluteUrl, getSiteUrl, PERSON_NAME } from '../../lib/site';
import Link from 'next/link';
import type { BlogPathParams, BlogPostPageProps, TocEntry } from '../../types/site';

function headingToSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function H2({ children }: { children?: React.ReactNode }) {
  const text = typeof children === 'string' ? children : '';
  return <h2 id={headingToSlug(text)}>{children}</h2>;
}

const components = {
  ConversationSummaryEmbed,
  h2: H2,
};

export default function BlogPost({ post, mdxSource, paginatedMdxSource, toc }: BlogPostPageProps) {
  const router = useRouter();
  const title = `${post.title} | Blog`;
  const description = post.description || post.excerpt || 'Blog post';
  const authorName = post.author || PERSON_NAME;
  const isFiction = post.articleType === 'fiction';
  const siteUrl = getSiteUrl();
  const locale = router.locale || router.defaultLocale || 'en';
  const pageUrl = getAbsoluteUrl(`/blog/${post.slug}`, locale);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    url: pageUrl,
    inLanguage: 'en-NZ',
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: authorName,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: PERSON_NAME,
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    articleSection: post.articleType || 'essay',
  };

  return (
    <Layout title={title} description={description} ogType="article" schema={schema} canonical={pageUrl}>
      {isFiction ? (
        <FictionReader post={post} pages={paginatedMdxSource} components={components} />
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Link
            href="/blog"
            className="inline-flex items-center text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 mb-8 transition-colors"
          >
            ← Back to Blog
          </Link>

          <div className="lg:flex lg:gap-12 xl:gap-16 lg:items-start">
            {toc.length > 0 && (
              <aside className="hidden lg:block w-48 xl:w-56 shrink-0 sticky top-24 self-start">
                <TableOfContents entries={toc} />
              </aside>
            )}

            <article className="min-w-0 flex-1">
              <header className="mb-12">
                <h1 className="text-5xl font-bold mb-4">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400">
                  {new Date(post.date).toLocaleDateString('en-NZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {post.readingTime && (
                    <>
                      <span aria-hidden="true">•</span>
                      <span>{post.readingTime}</span>
                    </>
                  )}
                </div>
              </header>

              {mdxSource && (
                <div className="prose prose-lg max-w-none">
                  <MDXRemote {...mdxSource} components={components} />
                </div>
              )}

              <footer className="mt-16 pt-8 border-t border-slate-700">
                <Link
                  href="/blog"
                  className="inline-flex items-center text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 transition-colors"
                >
                  ← Back to all posts
                </Link>
              </footer>
            </article>
          </div>
        </div>
      )}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths<BlogPathParams['params']> = async () => {
  const paths = getAllPostSlugs();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps, BlogPathParams['params']> = async ({ params }) => {
  if (!params?.slug) {
    throw new Error('Missing blog post slug');
  }

  const post = await getPostData(params.slug);
  const isFiction = post.articleType === 'fiction';
  const paginatedMdxSource = isFiction
    ? await Promise.all(getPostContentPages(post.content).map((page) => serialize(page)))
    : [];
  const mdxSource = isFiction ? null : await serialize(post.content);

  const toc: TocEntry[] = Array.from(post.content.matchAll(/^##\s+(.+)$/gm)).map((m) => {
    const text = m[1].trim();
    return {
      text,
      slug: text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'),
    };
  });

  return {
    props: {
      post: {
        slug: post.slug,
        title: post.title,
        author: post.author || null,
        date: post.date,
        description: post.description || '',
        excerpt: post.excerpt || '',
        readingTime: post.readingTime || '',
        articleType: post.articleType || '',
        footNotes: post.footNotes || '',
      },
      mdxSource,
      paginatedMdxSource,
      toc,
    },
  };
};