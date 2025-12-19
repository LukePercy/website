import Layout from'/../components/Layout';
import Link from 'next/link';
import { getSortedPostsData } from '../lib/blog';

export default function Blog({ posts }) {
  return (
    <Layout 
      title="Blog | Portfolio"
      description="Read my latest blog posts about development, technology, and more"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about software development
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article 
              key={post.slug}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-8">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 hover:text-autumn-orange transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                </Link>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-block text-autumn-orange hover:text-orange-600 font-medium transition-colors"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
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
