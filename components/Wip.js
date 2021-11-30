import React from "react";
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export default function Wip({posts}) {
  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800 dark:text-white">
        <h1 className="text-5xl md:text-9xl font-bold py-6 text-center md:text-left dark:text-white">
          Work<span className="text-lg">in progress.</span>
        </h1>
      </div>
      <div className="-mt-10 dark:bg-gray-900">
      <div className="grid grid-cols-3 pb-40 md:pb-20 sm:pb-5">
        <div className="xsm:col-start-1 xsm:col-span-3 md:col-start-2 md:col-span-1">
        {posts.map((item) => (
          <BlogListItem key={item.slug} {...item} />
        ))}
        </div>
      </div>
      </div>
    </section>
  );
}

function BlogListItem({ slug, title, date, blurb }) {
  return (
    <div className="pt-5">
    <div className="border border-gray-100 shadow hover:shadow-md hover:border-gray-200 rounded-md p-4 transition duration-200 ease-in">
      <div>
        <Link href={`/wip/${slug}`}>
          <a className="font-bold text-lg dark:text-white">{title}</a>
        </Link>
      </div>
      <div className="text-gray-900 text-sm dark:text-white">
        {format(parseISO(date), 'MMMM do, uuu')}
      </div>
      <div className="pt-2 pb-3 text-gray-300">{blurb}</div>
      <div>
      <Link href={`/wip/${slug}`}>
      <button className="hover:scale-110 hover:-rotate-3 transition duration-300 rounded-md bg-white shadow-lg text-xl font-semibold dark:text-gray-700 hover:bg-purple-500 rounded-md px-2 py-1 dark:hover:text-white">Click to read this article</button>
      </Link>
      </div>
    </div>
    </div>
  );
}