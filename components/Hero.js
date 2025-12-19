import React from 'react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Greeting */}
        <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
          Hello, I am
        </p>
        
        {/* Name */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6">
          Luke Percy
        </h1>
        
        {/* Tagline */}
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
          Agile Project Manager | CMS Specialist | Game Developer
        </p>
        
        {/* Description */}
        <p className="text-lg text-gray-700 dark:text-gray-400 mb-12 max-w-2xl leading-relaxed">
          With over 20 years in tech, I help teams deliver exceptional digital experiences through 
          agile practices, strategic project management, and technical expertise across gaming, 
          government, and enterprise platforms.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="#projects" 
            className="inline-block px-8 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white rounded-lg font-medium transition-colors text-center"
          >
            View My Work
          </a>
          <a 
            href="mailto:lpercy@ljpercy.com" 
            className="inline-block px-8 py-3 bg-transparent border-2 border-gray-900 dark:border-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 text-gray-900 dark:text-white rounded-lg font-medium transition-colors text-center"
          >
            Get in Touch
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-gray-400" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
