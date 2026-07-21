interface Service {
  title: string;
  description: string;
  points: string[];
}

const services: Service[] = [
  {
    title: 'Delivery Leadership & Governance',
    description: 'Leading delivery with clear governance, practical reporting, and measurable outcomes for teams and senior stakeholders.',
    points: [
      'Project health reporting, estimation, and velocity tracking',
      'OKRs, KPIs, and outcome-led planning',
      'Executive reporting and stakeholder alignment',
      'RACI models, RAID management, and clear escalation paths',
    ],
  },
  {
    title: 'CMS, DXP & Portfolio Planning',
    description: 'Delivering CMS and DXP platforms with governance, roadmap clarity, and portfolio visibility across competing priorities.',
    points: [
      'Platform delivery across Umbraco, Drupal, Silverstripe, and Squiz DXP',
      'Content governance and operating model clarity',
      'Portfolio visibility, capacity planning, and prioritisation',
      'Roadmaps that balance value, risk, and constraints',
    ],
  },
  {
    title: 'Product & Interactive Entertainment Delivery',
    description: 'Leading product and interactive entertainment delivery with strong cross-functional coordination, risk visibility, and release confidence.',
    points: [
      'Cross-discipline planning and delivery cadence',
      'Product discovery, prioritisation, and iterative delivery',
      'Release planning, milestone readiness, and production risk',
      'Video game delivery across pre-production, production, platform submissions, release, and live operations',      'Alignment between creative, technical, and commercial goals',
    ],
  },
];

export default function ServicesSection() {
  return (
    <section id="approach" aria-labelledby="approach-heading" className="scroll-mt-24 border-y border-slate-200/10 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-autumn-orange">Approach</p>
          <h2 id="approach-heading" className="text-3xl font-bold text-white sm:text-4xl">
            Clarity from strategy through delivery
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">
I connect people, evidence, and decisions so teams can move meaningful work forward, even when the path is uncertain.          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {services.map((service) => (
            <article key={service.title} className="border-t border-slate-200/20 pt-6">
              <h3 className="text-xl font-bold leading-snug text-white">
                {service.title}
              </h3>
              <p className="mt-4 leading-relaxed text-slate-300">
                {service.description}
              </p>
              <ul className="mt-5 space-y-2">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start text-slate-300">
                    <span aria-hidden="true" className="mr-2 text-autumn-orange">•</span>
                    <span className="text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}