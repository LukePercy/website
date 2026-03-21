import type { GetStaticProps } from 'next';

import Layout from '../components/Layout';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import StatsSection from '../components/StatsSection';
import CompaniesMarqueeSection from '../components/CompaniesMarqueeSection';
import ServicesSection from '../components/ServicesSection';
import ProjectsSection from '../components/ProjectsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import getLatestGithubRepos from '../lib/githubapi/getLatestRepos';
import getLatestGitLabRepos from '../lib/gitlabapi/getLatestRepos';
import { getAbsoluteUrl, getSiteUrl, PERSON_NAME, PERSON_SAME_AS } from '../lib/site';
import type { HomePageProps } from '../types/site';

export default function Home({ repos }: HomePageProps) {
  const title = 'L Percy - Technologist, Developer, and Project Manager';
  const description = 'Welcome to my portfolio showcasing projects and blog posts';
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
      jobTitle: 'Agile Project Manager',
    },
  };

  return (
    <Layout
      title={title}
      description={description}
      schema={schema}
    >
      <Hero />
      <AboutSection />
      <StatsSection />
      <CompaniesMarqueeSection />
      <ServicesSection />
      <ProjectsSection repos={repos} />
      <TestimonialsSection />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const [githubRepos, gitlabRepos] = await Promise.all([
    getLatestGithubRepos({
      githubUsername: process.env.GITHUB_USERNAME || 'yourusername',
    }),
    getLatestGitLabRepos(),
  ]);

  return {
    props: {
      repos: [...githubRepos, ...gitlabRepos],
    },
    revalidate: 3600,
  };
};