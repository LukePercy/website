import React from 'react';

export default function Hero() {
  const scrollToAbout = (event) => {
    event.preventDefault();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const about = document.getElementById('about');
    if (!about) return;

    about.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });

    about.focus?.({ preventScroll: true });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Greeting */}
        <p className="text-sm uppercase tracking-wider text-slate-400 mb-4">
          Hello, I am
        </p>

        {/* Name */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-6">
          Luke Percy
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-2xl">
          Project Manager • Web CMS Specialist • Game Producer & Developer
        </p>

        {/* Description */}
        <p className="text-lg text-slate-300 mb-12 max-w-2xl leading-relaxed">
          With over 20 years in tech, I help teams deliver exceptional digital experiences through
          agile practices, strategic project management, and technical expertise across video games,
          government, digital and enterprise platforms.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#projects"
            className="inline-block px-8 py-3 bg-slate-100 hover:bg-white text-slate-900 rounded-lg font-medium transition-colors text-center shadow-lg"
          >
            View My Work
          </a>
          <a
            href="mailto:lpercy@ljpercy.com"
            className="inline-block px-8 py-3 bg-transparent border-2 border-slate-400 hover:bg-slate-700/50 text-white rounded-lg font-medium transition-colors text-center"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        onClick={scrollToAbout}
        className="hero-scroll-indicator absolute bottom-24 left-1/2 transform -translate-x-1/2 animate-bounce rounded"
        aria-label="Scroll to About section"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          className="w-6 h-6 text-slate-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </a>
    </section>
  );
}
