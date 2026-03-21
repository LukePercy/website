import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import FictionReader from '../../components/FictionReader';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { getAllPostSlugs, getPostContentPages, getPostData } from '../../lib/blog';
import { getAbsoluteUrl, getSiteUrl, PERSON_NAME } from '../../lib/site';
import Link from 'next/link';
import type { BlogPathParams, BlogPostPageProps } from '../../types/site';

const components: any = {};

export default function BlogPost({ post, mdxSource, paginatedMdxSource }: BlogPostPageProps) {
  const router = useRouter();
  const title = `${post.title} | Blog`;
  const description = post.description || post.excerpt || 'Blog post';
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
      name: PERSON_NAME,
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
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Link
            href="/blog"
            className="inline-flex items-center text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 mb-8 transition-colors"
          >
            ← Back to Blog
          </Link>

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

  return {
    props: {
      post: {
        slug: post.slug,
        title: post.title,
        date: post.date,
        description: post.description || '',
        excerpt: post.excerpt || '',
        readingTime: post.readingTime || '',
        articleType: post.articleType || '',
        footNotes: post.footNotes || '',
      },
      mdxSource,
      paginatedMdxSource,
    },
  };
};