import React from 'react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Luke is passionate about agile delivery, helps upskill product owners, and communicates clearly with both developers and clients. His technical grounding and likeable style make him a formidable delivery lead.",
      author: 'Russ Michell',
      role: 'Bringing software delivery into the 2020s with Metaport',
      context: '7 November 2013 — reported directly to Luke',
    },
    {
      quote:
        "Luke brings great energy and enthusiasm, and is a genuinely productive part of any team.",
      author: 'Andy Macoy',
      role: 'Localisation Manager at PikPok',
      context: '7 December 2011 — worked with Luke on the same team',
    },
    {
      quote:
        "Efficient, thorough, and proactive in challenging productions — often taking on responsibilities well beyond the role. His positivity helped keep morale high and made the team more effective.",
      author: 'Andy Satterthwaite',
      role: 'Chief Design Officer at PikPok',
      context: '6 December 2011 — managed Luke directly',
    },
    {
      quote:
        'Luke is proactive, well organised, and an excellent communicator. Over time he grew from a strong team player into a leader — dedicated, passionate, and highly motivated.',
      author: 'David Robles 🇦🇺🇪🇸',
      role: 'APAC Marketing & Communications Director at Bethesda Softworks',
      context: "13 April 2010 — Luke's client",
    },
    {
      quote:
        "Luke has a great eye for detail and a strong sense of priorities. He thinks ahead, anticipates issues early, and adds value throughout delivery.",
      author: 'Alan Bell',
      role: 'Agilist',
      context: '13 April 2010 — managed Luke directly',
    },
  ];

  return (
    <section className="py-20 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-12">
          What People Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-700/50 p-6 rounded-lg backdrop-blur-sm">
              <blockquote className="text-slate-200 mb-4 italic">
                "{testimonial.quote}"
              </blockquote>
              <div className="text-sm">
                <div className="font-semibold text-white">
                  {testimonial.author}
                </div>
                <div className="text-slate-400">
                  {testimonial.role}
                </div>
                {testimonial.context && (
                  <div className="text-slate-400 mt-1">
                    {testimonial.context}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
