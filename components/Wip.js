import React from "react";
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { getAllPosts } from '../lib/data';

export default function Wip() {
  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800 dark:text-white">
        <h1 className=" text-5xl md:text-6xl xsm:text-2xl font-bold py-6 text-left dark:text-white">
          The Decks of the Hunter. <span className="block text-lg md:text-2xl md:text-left dark:text-white">(working title)</span>
        </h1>
      </div>
      <div className="space-y-4">
        {posts.map((item) => (
          <BlogListItem key={item.slug} {...item} />
        ))}
      </div>
    </section>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts();
  return {
    props: {
      posts: allPosts.map(({ data, content, slug }) => ({
        ...data,
        date: data.date.toISOString(),
        content,
        slug,
      })),
    },
  };
}

function BlogListItem({ slug, title, date, content }) {
  return (
    <div className="border border-gray-100 shadow hover:shadow-md hover:border-gray-200 rounded-md p-4 transition duration-200 ease-in">
      <div>
        <Link href={`/wip/${slug}`}>
          <a className="font-bold">{title}</a>
        </Link>
      </div>
      <div className="text-gray-600 text-xs">
        {format(parseISO(date), 'MMMM do, uuu')}
      </div>
      <div>{content.substr(0, 300)}</div>
    </div>
  );
}