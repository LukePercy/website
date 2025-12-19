import React from 'react';

export default function ServicesSection() {
  const services = [
    {
      title: 'Agile Project Management',
      description: 'Leading teams to deliver high-value products through proven agile methodologies.',
      points: [
        'Scrum, Kanban, and Lean practices',
        'Team coaching and agile transformation',
        'Product roadmap and backlog management',
        'Stakeholder alignment and communication',
      ],
    },
    {
      title: 'CMS Implementation & Strategy',
      description: 'Delivering enterprise content management solutions that drive business outcomes.',
      points: [
        'Umbraco, Drupal, Silverstripe, Squiz DXP',
        'Government and enterprise platforms',
        'Migration and integration strategies',
        'Multimillion-dollar project delivery',
      ],
    },
    {
      title: 'Game Development Leadership',
      description: 'Managing game production from concept to launch across multiple platforms.',
      points: [
        'Console, PC, and mobile game delivery',
        'Cross-functional team coordination',
        'Publisher and stakeholder management',
        '15+ shipped titles including AAA franchises',
      ],
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          What I Do
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {services.map((service, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.points.map((point, i) => (
                  <li key={i} className="flex items-start text-gray-700 dark:text-gray-300">
                    <span className="text-autumn-orange mr-2">•</span>
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
