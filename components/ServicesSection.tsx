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
      'Risk, dependency, and decision management',
    ],
  },
  {
    title: 'CMS, DXP & Portfolio Planning',
    description: 'Delivering CMS and DXP platforms with governance, roadmap clarity, and portfolio visibility across competing priorities.',
    points: [
      'Umbraco, Drupal, Silverstripe, Squiz DXP',
      'Content governance and operating model clarity',
      'Portfolio visibility, capacity planning, and prioritisation',
      'Roadmaps that balance value, risk, and constraints',
    ],
  },
  {
    title: 'Product & Game Delivery Leadership',
    description: 'Leading product and game delivery with strong cross-functional coordination, risk visibility, and release confidence.',
    points: [
      'Cross-discipline planning and delivery cadence',
      'RACI models, RAID management, and clear escalation paths',
      'Stakeholder communication and executive-ready reporting',
      'Alignment between creative, technical, and commercial goals',
    ],
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          How I Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {services.map((service) => (
            <div key={service.title} className="space-y-4">
              <h3 className="text-xl font-bold text-white">
                {service.title}
              </h3>
              <p className="text-slate-300">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start text-slate-300">
                    <span aria-hidden="true" className="text-autumn-orange mr-2">•</span>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}