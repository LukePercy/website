import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children, title = 'Luke Percy - Agile Project Manager', description = 'Experienced Agile Project Manager specializing in game development, CMS platforms, and government digital services' }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-lg font-semibold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                Luke Percy
              </Link>
              
              <div className="flex space-x-6">
                <Link 
                  href="/"
                  className={`text-sm font-medium transition-colors ${
                    router.pathname === '/' 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/blog"
                  className={`text-sm font-medium transition-colors ${
                    router.pathname.startsWith('/blog') 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Blog
                </Link>
                <Link 
                  href="/about"
                  className={`text-sm font-medium transition-colors ${
                    router.pathname === '/about' 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Contact Section */}
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Would you like to contact me directly?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Let's connect. Tell me about your project or just say hello.
              </p>
              <a 
                href="mailto:lpercy@ljpercy.com"
                className="inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg font-medium transition-colors"
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
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://linkedin.com/in/lukepercy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://amazon.com/author/lukepercy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Amazon Author Page"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.544.406-3.045.61-4.516.61-2.14 0-4.16-.326-6.063-.977-1.9-.653-3.64-1.587-5.22-2.808-.244-.16-.37-.31-.37-.46 0-.063.01-.116.03-.16zm23.696-1.31c-.19-.23-.51-.34-.95-.34-.256 0-.57.05-.94.14-.37.097-.7.21-.98.35l-.54.28c-.278.148-.48.278-.615.39l-.156.15c-.062.058-.1.09-.11.093-.06.034-.1-.002-.13-.108-.016-.055-.016-.165 0-.33.04-.205.1-.43.19-.664.09-.238.21-.45.36-.628.63-.76 1.66-1.14 3.09-1.14.586 0 1.14.09 1.67.26.53.17.96.42 1.29.74.334.323.57.71.71 1.16.14.452.21.94.21 1.463v4.375c0 .44.05.77.14.995.09.22.22.33.39.33.11 0 .24-.05.39-.14.15-.097.31-.23.48-.403.04-.04.09-.047.13-.017.042.03.062.084.062.16 0 .097-.04.21-.12.35-.29.41-.64.73-1.05.95-.41.22-.87.33-1.38.33-.58 0-1.06-.18-1.45-.55-.39-.37-.61-.85-.66-1.44-.53.62-1.14 1.11-1.82 1.47-.68.36-1.43.54-2.23.54-.61 0-1.17-.11-1.68-.32-.51-.214-.94-.51-1.297-.894-.355-.383-.63-.84-.82-1.37-.19-.525-.29-1.1-.29-1.72 0-.66.11-1.27.33-1.83.22-.56.52-1.04.9-1.45.38-.4.82-.735 1.32-.994.5-.26 1.02-.45 1.57-.56l3.23-.67v-.58c0-.72-.18-1.29-.55-1.72-.37-.43-.93-.646-1.69-.646-.53 0-.96.09-1.3.26-.34.174-.58.397-.73.67-.084.143-.15.29-.19.436-.04.146-.08.26-.12.34l-.14.21c-.08.14-.25.24-.5.3-.25.06-.43-.02-.54-.25-.06-.15-.09-.3-.09-.47 0-.31.12-.59.37-.83.25-.24.57-.44.97-.6.39-.16.83-.29 1.31-.39.48-.1.96-.15 1.44-.15.72 0 1.4.09 2.02.26.62.17 1.16.44 1.62.81.46.37.82.85 1.08 1.44.26.59.39 1.29.39 2.1v5.17c0 .46.03.77.09.94.06.17.16.25.3.25.12 0 .25-.05.39-.14.14-.1.28-.22.42-.38.04-.04.09-.06.14-.06.05 0 .09.03.12.08.03.05.05.11.05.18 0 .08-.03.17-.08.26-.19.3-.45.56-.78.78-.33.22-.72.33-1.17.33-.38 0-.7-.1-.97-.28-.27-.19-.45-.45-.55-.79zm-4.01.54v-3.04l-1.74.35c-.68.14-1.25.38-1.72.73-.47.35-.7.87-.7 1.56 0 .64.18 1.14.55 1.5.37.36.84.54 1.41.54.62 0 1.18-.21 1.68-.63.5-.42.75-.92.75-1.51z"/>
                </svg>
              </a>
            </div>
            
            {/* Copyright */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>&copy; {new Date().getFullYear()} Luke Percy | lukepercy.com</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
