import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MDXRemote } from 'next-mdx-remote';
import { ChevronDown } from 'lucide-react';

import type { TouchEvent } from 'react';
import type { FictionReaderProps } from '../types/site';

const SWIPE_THRESHOLD = 56;

function getPageIndexFromQuery(pageValue: string | string[] | undefined, totalPages: number): number {
  const rawPage = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const parsedPage = Number.parseInt(rawPage || '1', 10);

  if (Number.isNaN(parsedPage) || parsedPage < 1) {
    return 0;
  }

  return Math.min(parsedPage - 1, Math.max(totalPages - 1, 0));
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function FictionReader({ post, pages = [], components }: FictionReaderProps) {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);
  const readerRef = useRef<HTMLElement | null>(null);
  const totalPages = pages.length;

  const scrollToReaderTop = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const isDesktopViewport =
      window.matchMedia && window.matchMedia('(min-width: 1024px)').matches;

    if (!isDesktopViewport) {
      return;
    }

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!readerRef.current) {
      return;
    }

    const readerTop = readerRef.current.getBoundingClientRect().top + window.scrollY;
    const scrollTarget = Math.max(readerTop - 24, 0);

    window.scrollTo({
      top: scrollTarget,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const setPageAndUrl = (nextPageIndex: number) => {
    const boundedPageIndex = Math.max(0, Math.min(nextPageIndex, totalPages - 1));

    setPageIndex(boundedPageIndex);

    if (!router.isReady) {
      return;
    }

    const nextQuery = { ...router.query };

    if (boundedPageIndex === 0) {
      delete nextQuery.page;
    } else {
      nextQuery.page = String(boundedPageIndex + 1);
    }

    void router.replace(
      {
        pathname: router.pathname,
        query: nextQuery,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    );
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setPageIndex(getPageIndexFromQuery(router.query.page, totalPages));
  }, [router.isReady, router.query.page, totalPages, post.slug]);

  useEffect(() => {
    if (typeof window === 'undefined' || totalPages <= 1) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setPageAndUrl(pageIndex - 1);
      }

      if (event.key === 'ArrowRight') {
        setPageAndUrl(pageIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pageIndex, totalPages, router.isReady, router.pathname, router.query]);

  if (totalPages === 0) {
    return null;
  }

  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === totalPages - 1;
  const progress = `${((pageIndex + 1) / totalPages) * 100}%`;

  const goToPreviousPage = () => {
    setPageAndUrl(pageIndex - 1);
    scrollToReaderTop();
  };

  const goToNextPage = () => {
    setPageAndUrl(pageIndex + 1);
    scrollToReaderTop();
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touchPoint = event.changedTouches[0];
    touchStartXRef.current = touchPoint.clientX;
    touchCurrentXRef.current = touchPoint.clientX;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    touchCurrentXRef.current = event.changedTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchCurrentXRef.current === null) {
      return;
    }

    const swipeDistance = touchStartXRef.current - touchCurrentXRef.current;

    if (Math.abs(swipeDistance) >= SWIPE_THRESHOLD) {
      if (swipeDistance > 0) {
        goToNextPage();
      } else {
        goToPreviousPage();
      }
    }

    touchStartXRef.current = null;
    touchCurrentXRef.current = null;
  };

  return (
    <article ref={readerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
      <Link
        href="/blog"
        className="inline-flex items-center text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 mb-8 transition-colors"
      >
        ← Back to Blog
      </Link>

      <div className="fiction-reader-shell rounded-[2rem] border border-white/10 px-4 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <header className="lg:sticky lg:top-28 self-start">
            <div className="inline-flex items-center rounded-full border border-amber-100/30 bg-amber-100/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100 mb-6">
              Digital Fiction
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-balance">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                {post.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300 mb-8">
              <span>{formatDate(post.date)}</span>
              {post.readingTime && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>{post.readingTime}</span>
                </>
              )}
              <span aria-hidden="true">•</span>
              <span>{totalPages} pages</span>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400 mb-3">
                <span>Progress</span>
                <span aria-live="polite">Page {pageIndex + 1} of {totalPages}</span>
              </div>

              <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-4">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 transition-[width] duration-300 ease-out"
                  style={{ width: progress }}
                />
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Swipe left or right on mobile, or use the arrow keys and page controls to turn the page.
              </p>
            </div>

            {post.footNotes && (
              <details className="mt-5 overflow-hidden rounded-3xl border border-amber-100/15 bg-amber-100/[0.07] shadow-[0_18px_35px_rgba(15,23,42,0.18)] backdrop-blur-sm group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left marker:hidden sm:px-5 sm:py-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-100/80">
                    Reader Notes
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-100/20 bg-white/5 text-amber-50 transition-transform duration-200 group-open:rotate-180">
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </span>
                </summary>

                <div className="border-t border-white/10 px-4 py-5 sm:px-6 sm:py-6">
                  <p className="max-w-none text-[0.96rem] leading-8 text-slate-100 sm:text-base sm:leading-8">
                    {post.footNotes}
                  </p>
                </div>
              </details>
            )}
          </header>

          <section>
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-3 sm:p-4">
              <div
                key={pageIndex}
                className="fiction-page fiction-page-enter min-h-[65vh] sm:min-h-[70vh] px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="relative z-[1] flex items-center justify-between gap-4 border-b border-stone-400/30 pb-4 mb-6 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-stone-500">
                  <span>Digital Novel</span>
                  <span>{String(pageIndex + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}</span>
                </div>

                <div className={`fiction-page-content${isFirstPage ? ' fiction-page-content--opening' : ''}`}>
                  <MDXRemote {...pages[pageIndex]} components={components} />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-300">
                {isLastPage ? 'End of story' : 'Continue reading →'}
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={isFirstPage}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={isLastPage}
                  className="rounded-full border border-amber-200/30 bg-amber-100/10 px-5 py-2.5 text-sm font-medium text-amber-50 transition-colors hover:bg-amber-100/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}