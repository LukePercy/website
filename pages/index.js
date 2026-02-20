import Layout from '../components/Layout';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import StatsSection from '../components/StatsSection';
import CompaniesMarqueeSection from '../components/CompaniesMarqueeSection';
import ServicesSection from '../components/ServicesSection';
import ProjectsSection from '../components/ProjectsSection';
import TestimonialsSection from '../components/TestimonialsSection';

export default function Home() {
  const title = 'L Percy - Technologist, Developer, and Project Manager';
  const description = 'Welcome to my portfolio showcasing projects and blog posts';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ljpercy.com').replace(/\/$/, '');
  const pageUrl = `${siteUrl}/`;
  const personSameAs = [
    'https://github.com/lukepercy',
    'https://linkedin.com/in/lukepercy',
    'https://www.amazon.com/stores/Luke-Percy/author/B092TDRNYC',
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: title,
    description,
    url: pageUrl,
    inLanguage: 'en-NZ',
    mainEntity: {
      '@type': 'Person',
      name: 'Luke Percy',
      url: siteUrl,
      sameAs: personSameAs,
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
      <ProjectsSection />
      <TestimonialsSection />
    </Layout>
  );
}
