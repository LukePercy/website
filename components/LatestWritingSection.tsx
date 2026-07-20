import Link from 'next/link';

import type { BlogPostSummary } from '../types/site';

interface LatestWritingSectionProps {
  posts: BlogPostSummary[];
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function LatestWritingSection({ posts }: LatestWritingSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-slate-200/10 py-20 sm:py-24" aria-labelledby="latest-writing-heading">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-autumn-orange">Latest writing</p>
            <h2 id="latest-writing-heading" className="text-3xl font-bold text-white sm:text-4xl">
              Ideas from the work
            </h2>
          </div>
          <Link
            href="/blog"
            className="w-fit rounded-sm font-medium text-white underline decoration-slate-500 underline-offset-4 transition-colors hover:decoration-autumn-orange focus-visible:ring-2 focus-visible:ring-autumn-orange"
          >
            View all writing
          </Link>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-t border-slate-200/20 pt-6">
              <p className="text-sm text-slate-400">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.readingTime ? ` • ${post.readingTime}` : ''}
              </p>
              <h3 className="mt-3 text-xl font-bold leading-snug text-white">
                <Link
                  href={`/blog/${post.slug}`}
                  className="rounded-sm transition-colors hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-autumn-orange"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="mt-4 line-clamp-4 leading-relaxed text-slate-300">
                {post.excerpt || post.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}