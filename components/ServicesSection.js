import React from 'react';

export default function ServicesSection() {
  const services = [
    {
      title: 'Agile Project Management',
      description: 'Outcome-led delivery with continuous discovery, grounded in sustainable Agile values and fast feedback.',
      points: [
        'Outcome focus and measurable goals',
        'Transparency, collaboration, and psychological safety',
        'Continuous improvement and sustainable pace',
        'Stakeholder alignment and feedback loops',
      ],
    },
    {
      title: 'DXP Implementation & Strategy',
      description: 'Delivering CMS and DXP platforms with an iterative approach, aligned to user needs and business outcomes.',
      points: [
        'Umbraco, Drupal, Silverstripe, Squiz DXP',
        'User-centred delivery and content governance',
        'Incremental migrations and integration planning',
        'Roadmaps that balance value, risk, and constraints',
      ],
    },
    {
      title: 'Game Development Leadership',
      description: 'Leading video game development teams with clear outcomes, fast feedback, and strong cross-discipline alignment.',
      points: [
        'Iterative production planning and delivery',
        'Cross-functional collaboration across disciplines',
        'Risk management and release readiness',
        'Stakeholder communication and expectation management',
      ],
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          How I Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {services.map((service, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-xl font-bold text-white">
                {service.title}
              </h3>
              <p className="text-slate-300">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.points.map((point, i) => (
                  <li key={i} className="flex items-start text-slate-300">
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
