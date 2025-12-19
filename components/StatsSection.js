import React from 'react';

export default function StatsSection() {
  const stats = [
    {
      number: '20+',
      label: 'Years in Tech',
    },
    {
      number: '15+',
      label: 'Major Game Titles',
    },
    {
      number: '£50M+',
      label: 'Product Revenue',
    },
    {
      number: '100+',
      label: 'Projects Delivered',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.number}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
