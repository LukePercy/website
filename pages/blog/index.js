import Layout from '../../components/Layout';
import Link from 'next/link';
import { getSortedPostsData } from '../../lib/blog';

export default function Blog({ posts }) {
  const title = 'Blog | Portfolio';
  const description = 'Read my latest blog posts about development, technology, and more';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ljpercy.com').replace(/\/$/, '');
  const pageUrl = `${siteUrl}/blog`;
  const itemListElements = posts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: post.title,
    url: `${siteUrl}/blog/${post.slug}`,
  }));
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: pageUrl,
    inLanguage: 'en-NZ',
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: posts.length,
      itemListElement: itemListElements,
    },
  };

  return (
    <Layout
      title={title}
      description={description}
      schema={schema}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Blog
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about software development
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden hover:border-slate-500/60 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="underline decoration-slate-600 hover:decoration-slate-200 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>

                <div className="text-sm text-slate-400 mb-4">
                  {new Date(post.date).toLocaleDateString('en-NZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>

                <p className="text-slate-300 mb-4">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-block text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 font-medium transition-colors"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center text-slate-300 py-12">
            No blog posts yet. Check back soon!
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = getSortedPostsData();

  return {
    props: {
      posts,
    },
  };
}
