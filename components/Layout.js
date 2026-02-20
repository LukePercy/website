import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({
  children,
  title = 'Luke Percy - Agile Project Manager',
  description = 'Experienced Agile Project Manager specialising in game development, CMS platforms, and government digital services',
  canonical,
  ogImage,
  ogType = 'website',
  schema,
}) {
  const rafRef = useRef(null);
  const router = useRouter();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ljpercy.com').replace(/\/$/, '');
  const path = (router.asPath || '/').split('?')[0];
  const canonicalUrl = canonical || `${siteUrl}${path === '/' ? '' : path}`;
  const siteName = 'Luke Percy';
  const personSameAs = [
    'https://github.com/lukepercy',
    'https://linkedin.com/in/lukepercy',
    'https://www.amazon.com/stores/Luke-Percy/author/B092TDRNYC',
  ];

  const baseSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      alternateName: 'L Percy',
      url: siteUrl,
      description,
      inLanguage: 'en-NZ',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: siteName,
      url: siteUrl,
      sameAs: personSameAs,
      jobTitle: 'Agile Project Manager',
      description:
        'Technologist, developer, and project manager with experience across game development, CMS platforms, and government digital services.',
    },
  ];

  const pageSchemas = Array.isArray(schema) ? schema : schema ? [schema] : [];
  const structuredData = [...baseSchemas, ...pageSchemas];

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const colors = [
      '#10325c',
      '#0d3f67',
      '#11506f',
      '#1b4a6b',
      '#0f2f5f',
    ];

    const applyBackground = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
      const scaled = progress * (colors.length - 1);
      const index = Math.floor(scaled);
      const nextIndex = Math.min(index + 1, colors.length - 1);
      const blend = scaled - index;

      const mixColor = (from, to, amount) => {
        const f = from.replace('#', '');
        const t = to.replace('#', '');
        const fr = parseInt(f.slice(0, 2), 16);
        const fg = parseInt(f.slice(2, 4), 16);
        const fb = parseInt(f.slice(4, 6), 16);
        const tr = parseInt(t.slice(0, 2), 16);
        const tg = parseInt(t.slice(2, 4), 16);
        const tb = parseInt(t.slice(4, 6), 16);
        const r = Math.round(fr + (tr - fr) * amount);
        const g = Math.round(fg + (tg - fg) * amount);
        const b = Math.round(fb + (tb - fb) * amount);
        return `rgb(${r}, ${g}, ${b})`;
      };

      doc.style.setProperty('--page-bg', mixColor(colors[index], colors[nextIndex], blend));
    };

    const handleScroll = () => {
      if (rafRef.current) {
        return;
      }
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        applyBackground();
      });
    };

    applyBackground();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="author" content="Luke Percy" />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={siteName} />
        {ogImage ? <meta property="og:image" content={ogImage} /> : null}
        <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
        {structuredData.length > 0 ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        ) : null}
      </Head>

      <div className="gradient-bg flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {/* Navigation */}
        <nav
          className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 z-50"
          aria-label="Primary"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex justify-between items-center h-20">
              <Link
                href="/"
                aria-current={router.pathname === '/' ? 'page' : undefined}
                className={`text-xl font-bold transition-colors ${router.pathname === '/'
                  ? 'text-white underline decoration-slate-500 underline-offset-4'
                  : 'text-slate-200 hover:text-white'
                  }`}
              >
                Home
              </Link>

              <div className="flex items-center gap-8">
                <Link
                  href="/blog"
                  aria-current={router.pathname.startsWith('/blog') ? 'page' : undefined}
                  className={`text-base font-medium px-4 py-2 rounded-full transition-all ${router.pathname.startsWith('/blog')
                    ? 'bg-slate-800/60 text-white border border-slate-700/50'
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                >
                  Blog
                </Link>
                <Link
                  href="/about"
                  aria-current={router.pathname === '/about' ? 'page' : undefined}
                  className={`text-base font-medium px-4 py-2 rounded-full transition-all ${router.pathname === '/about'
                    ? 'bg-slate-800/60 text-white border border-slate-700/50'
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main id="main-content" tabIndex={-1} className="flex-grow pt-20">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Contact Section */}
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-white mb-4">
                Would you like to contact me directly?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Let's connect. Tell me about your project or just say hello.
              </p>
              <a
                href="mailto:lpercy@ljpercy.com"
                className="inline-block px-8 py-3 bg-slate-100 text-slate-900 hover:bg-white rounded-lg font-medium transition-colors shadow-lg"
              >
                Contact Me
              </a>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-6 mb-8">
              <a
                href="https://github.com/lukepercy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg aria-hidden="true" focusable="false" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/lukepercy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg aria-hidden="true" focusable="false" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.amazon.com/stores/Luke-Percy/author/B092TDRNYC"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Amazon Author Page"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center text-sm text-slate-400">
              <p>&copy; {new Date().getFullYear()} Luke Percy | ljpercy.com</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
