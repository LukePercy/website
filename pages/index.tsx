import type { GetStaticProps } from 'next';

import Layout from '../components/Layout';
import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import ServicesSection from '../components/ServicesSection';
import ProjectsSection from '../components/ProjectsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import LatestWritingSection from '../components/LatestWritingSection';
import { getSortedPostsData } from '../lib/blog';
import { getAbsoluteUrl, getSiteUrl, PERSON_NAME, PERSON_SAME_AS } from '../lib/site';
import type { BlogPostSummary } from '../types/site';

interface HomePageProps {
  latestPosts: BlogPostSummary[];
}

export default function Home({ latestPosts }: HomePageProps) {
  const title = 'L Percy - Delivery Lead, Programme Manager, and Digital Leader';
  const description = 'Senior delivery lead and technologist helping management and C-suite leaders deliver digital transformation, web CMS platforms, product strategy, and interactive entertainment.';
  const siteUrl = getSiteUrl();
  const pageUrl = getAbsoluteUrl('/');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: title,
    description,
    url: pageUrl,
    inLanguage: 'en-NZ',
    mainEntity: {
      '@type': 'Person',
      name: PERSON_NAME,
      url: siteUrl,
      sameAs: PERSON_SAME_AS,
      jobTitle: 'Delivery Lead, Digital Advisory Leader, and Technology Leadership',
      description,
      knowsAbout: [
        'Delivery leadership',
        'Programme management',
        'Project management',
        'Digital transformation',
        'Executive stakeholder management',
        'Web CMS strategy',
        'Interactive entertainment',
        'Product delivery',
      ],
    },
  };

  return (
    <Layout
      title={title}
      description={description}
      schema={schema}
    >
      <Hero />
      <ServicesSection />
      <StatsSection />
      <ProjectsSection />
      <TestimonialsSection />
      <LatestWritingSection posts={latestPosts} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  return {
    props: {
      latestPosts: getSortedPostsData().slice(0, 3),
    },
  };
};