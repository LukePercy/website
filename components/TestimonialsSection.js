import React from 'react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: 'Exceptional work ethic and technical skills. Delivered beyond expectations.',
      author: 'Client Name',
      role: 'CEO, Company Name',
    },
    {
      quote: 'A pleasure to work with. Clear communication and high-quality results.',
      author: 'Client Name',
      role: 'CTO, Tech Startup',
    },
    {
      quote: 'Brought fresh ideas and solved complex problems with elegant solutions.',
      author: 'Client Name',
      role: 'Product Manager, Enterprise',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
          What People Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <blockquote className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "{testimonial.quote}"
              </blockquote>
              <div className="text-sm">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.author}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
