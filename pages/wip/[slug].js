import ContainerBlock from '../../components/ContainerBlock';
import { format, parseISO } from 'date-fns';
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import { getAllPosts } from '../../lib/data';
import { useRouter } from 'next/router';

export default function BlogPage({ title, date, content }) {
  const hydratedContent = MDXRemote(content);
  const router = useRouter();
  
  return (
      <ContainerBlock>
        <div className="grid grid-cols-1 md:grid-cols-8 lg:-mt-8 pb-5 md:pb-10"> 
        <div className="border-b-2 border-gray-200 md:col-start-4 md:col-span-2">
          <h1 className="text-2xl md:text-6xl font-bold py-6 text-center md:text-left dark:text-white">
            {title}
            </h1>
          <div className="text-gray-600 dark:text-white text-center md:text-left">
            {format(parseISO(date), 'MMMM do, uuu')}
          </div>
        </div>
      </div>
          <div className="grid grid-cols-8 dark:bg-gray-900">
            <span className="flex sm:text-sm md:text-2xl md:col-start-4 cursor-pointer hover:text-purple-500" onClick={() => router.back()}>&larr;<span className="pl-1">Back</span></span>
          </div>
      <div className="grid grid-cols-8 dark:bg-gray-900 md:p-5 place-items-centre">
        <div className="xsm:pt-5 xsm:col-start-1 xsm:col-span-7 xsm:pl-5 sm:col-start-4 sm:col-span-3 md:pt-1">
            <div className="dark:prose-dark leading-relaxed prose">{hydratedContent}</div>
        </div>
      </div>
      </ContainerBlock>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  const allPosts = getAllPosts();
  const { data, content } = allPosts.find((item) => item.slug === params.slug);
  const mdxSource = await serialize(content);

  return {
    props: {
      ...data,
      date: data.date.toISOString(),
      content: mdxSource,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: getAllPosts().map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
}