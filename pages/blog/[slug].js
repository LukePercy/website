import Layout from '../../components/Layout';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { getAllPostSlugs, getPostData } from '../../lib/blog';
import Link from 'next/link';

const components = {
  // Add custom components here if needed
};

export default function BlogPost({ post, mdxSource }) {
  const title = `${post.title} | Blog`;
  const description = post.excerpt || 'Blog post';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ljpercy.com').replace(/\/$/, '');
  const pageUrl = `${siteUrl}/blog/${post.slug}`;
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
      name: 'Luke Percy',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Luke Percy',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  };

  return (
    <Layout
      title={title}
      description={description}
      ogType="article"
      schema={schema}
    >
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 mb-8 transition-colors"
        >
          ← Back to Blog
        </Link>

        {/* Post header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4">
            {post.title}
          </h1>
          <div className="text-slate-400">
            {new Date(post.date).toLocaleDateString('en-NZ', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </header>

        {/* Post content */}
        <div className="prose prose-lg max-w-none">
          <MDXRemote {...mdxSource} components={components} />
        </div>

        {/* Post footer */}
        <footer className="mt-16 pt-8 border-t border-slate-700">
          <Link
            href="/blog"
            className="inline-flex items-center text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 transition-colors"
          >
            ← Back to all posts
          </Link>
        </footer>
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostSlugs();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostData(params.slug);
  const mdxSource = await serialize(post.content);

  return {
    props: {
      post: {
        slug: post.slug,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt || '',
      },
      mdxSource,
    },
  };
}
