import ContainerBlock from '../../components/ContainerBlock';
import { format, parseISO } from 'date-fns';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import { getAllPosts } from '../../lib/data';

export default function BlogPage({ title, date, content }) {
  const hydratedContent = hydrate(content);
  return (
      <ContainerBlock>
        <div className="grid grid-cols-8 lg:-mt-8 pb-40 md:pb-10 sm:pb-5"> 
        <div className="border-b-2 border-gray-200 mb-4 col-start-4 col-span-2">
          <h2 className="text-5xl md:text-9xl font-bold py-6 text-center md:text-left dark:text-white">
            {title}
            </h2>
          <div className="text-gray-600 dark:text-white text-md text-center md:text-left">
            {format(parseISO(date), 'MMMM do, uuu')}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-8 dark:bg-gray-900 pt-5">
        <div className="col-start-4 col-span-2 rounded-lg">
          <div className="dark:bg-gray-900 prose-default dark:prose-dark">{hydratedContent}
        </div>
        </div>
      </div>
      </ContainerBlock>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  const allPosts = getAllPosts();
  const { data, content } = allPosts.find((item) => item.slug === params.slug);
  const mdxSource = await renderToString(content);

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