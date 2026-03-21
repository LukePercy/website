import { useState } from 'react';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { getArticleTypeLabel } from '../../lib/articleTypes';
import { getSortedPostsData } from '../../lib/blog';
import { getAbsoluteUrl } from '../../lib/site';
import type { BlogIndexProps } from '../../types/site';

export default function Blog({ posts, articleTypes }: BlogIndexProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const router = useRouter();
  const title = 'Blog | Portfolio';
  const description = 'Read my latest blog posts about development, technology, and more';
  const locale = router.locale || router.defaultLocale || 'en';
  const pageUrl = getAbsoluteUrl('/blog', locale);
  const filterOptions = [
    { value: 'all', label: 'All posts', count: posts.length },
    ...articleTypes.map((articleType) => ({
      value: articleType,
      label: getArticleTypeLabel(articleType),
      count: posts.filter((post) => post.articleType === articleType).length,
    })),
  ];
  const filteredPosts = activeFilter === 'all'
    ? posts
    : posts.filter((post) => post.articleType === activeFilter);
  const itemListElements = posts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: post.title,
    url: getAbsoluteUrl(`/blog/${post.slug}`, locale),
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
    <Layout title={title} description={description} schema={schema} canonical={pageUrl}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Blog
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about software development
          </p>
        </div>

        <section className="mb-12" aria-labelledby="article-type-filters">
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-700/50 bg-slate-900/35 p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="article-type-filters" className="text-lg font-semibold text-white">
                  Filter by article type
                </h2>
              </div>
              <p className="text-sm text-slate-300">
                Showing {filteredPosts.length} of {posts.length} posts
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {filterOptions.map((option) => {
                const isActive = option.value === activeFilter;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveFilter(option.value)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isActive
                      ? 'border-amber-200/40 bg-amber-100/15 text-amber-50'
                      : 'border-slate-600/70 bg-slate-800/45 text-slate-200 hover:border-slate-400/70 hover:text-white'
                      }`}
                  >
                    <span>{option.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${isActive
                      ? 'bg-amber-50/15 text-amber-100'
                      : 'bg-slate-700/80 text-slate-300'
                      }`}>
                      {option.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="space-y-8">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className={`rounded-lg border overflow-hidden transition-all shadow-lg hover:shadow-xl ${post.articleType === 'fiction'
                ? 'bg-amber-50/10 border-amber-200/20 hover:border-amber-100/40'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-500/60'
                }`}
            >
              <div className="p-8">
                {post.articleType === 'fiction' && (
                  <div className="inline-flex items-center rounded-full border border-amber-100/30 bg-amber-100/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100 mb-5">
                    Digital Fiction
                  </div>
                )}

                <h2 className="text-3xl font-bold mb-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="underline decoration-slate-600 hover:decoration-slate-200 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400 mb-4">
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

                <p className="text-slate-300 mb-4">
                  {post.excerpt || post.description}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-block text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 font-medium transition-colors"
                >
                  {post.articleType === 'fiction' ? 'Open reader →' : 'Read more →'}
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

        {posts.length > 0 && filteredPosts.length === 0 && (
          <div className="text-center text-slate-300 py-12">
            No posts match this article type yet.
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  const posts = getSortedPostsData();
  const articleTypes = Array.from(new Set(posts.map((post) => post.articleType))).sort((left, right) => {
    if (left === 'article') {
      return -1;
    }

    if (right === 'article') {
      return 1;
    }

    return left.localeCompare(right);
  });

  return {
    props: {
      posts,
      articleTypes,
    },
  };
};