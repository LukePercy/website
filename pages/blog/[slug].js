import Layout from '/../components/Layout';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { getAllPostSlugs, getPostData } from '../../lib/blog';
import Link from 'next/link';

const components = {
  // Add custom components here if needed
};

export default function BlogPost({ post, mdxSource }) {
  return (
    <Layout 
      title={`${post.title} | Blog`}
      description={post.excerpt || 'Blog post'}
    >
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back link */}
        <Link 
          href="/blog"
          className="inline-flex items-center text-autumn-orange hover:text-orange-600 mb-8 transition-colors"
        >
          ← Back to Blog
        </Link>

        {/* Post header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          <div className="text-gray-600 dark:text-gray-400">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </header>

        {/* Post content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote {...mdxSource} components={components} />
        </div>

        {/* Post footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link 
            href="/blog"
            className="inline-flex items-center text-autumn-orange hover:text-orange-600 transition-colors"
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
