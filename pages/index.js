import Layout from '../components/Layout';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import StatsSection from '../components/StatsSection';
import ServicesSection from '../components/ServicesSection';
import ProjectsSection from '../components/ProjectsSection';
import TestimonialsSection from '../components/TestimonialsSection';

export default function Home() {
  return (
    <Layout 
      title="Portfolio | Home"
      description="Welcome to my portfolio showcasing projects and blog posts"
    >
      <Hero />
      <AboutSection />
      <StatsSection />
      <ServicesSection />
      <ProjectsSection />
      <TestimonialsSection />
    </Layout>
  );
}
