interface Testimonial {
  quote: string;
  author: string;
  role: string;
  context?: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'Luke is passionate about agile delivery, helps upskill product owners, and communicates clearly with both developers and clients. His technical grounding and likeable style make him a formidable delivery lead.',
    author: 'Russ Michell',
    role: 'Bringing software delivery into the 2020s with Metaport',
    context: '7 November 2013 — reported directly to Luke',
  },
  {
    quote:
      'Luke brings great energy and enthusiasm, and is a genuinely productive part of any team.',
    author: 'Andy Macoy',
    role: 'Localisation Manager at PikPok',
    context: '7 December 2011 — worked with Luke on the same team',
  },
  {
    quote:
      'Efficient, thorough, and proactive in challenging productions — often taking on responsibilities well beyond the role. His positivity helped keep morale high and made the team more effective.',
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
      'Luke has a great eye for detail and a strong sense of priorities. He thinks ahead, anticipates issues early, and adds value throughout delivery.',
    author: 'Alan Bell',
    role: 'Agilist',
    context: '13 April 2010 — managed Luke directly',
  },
];

export default function TestimonialsSection() {
  const [featured, ...supporting] = testimonials;

  return (
    <section aria-labelledby="testimonials-heading" className="border-t border-slate-200/10 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-autumn-orange">Recommendations</p>
          <h2 id="testimonials-heading" className="text-3xl font-bold text-white sm:text-4xl">What colleagues say</h2>
        </div>

        <figure className="mx-auto mt-12 max-w-3xl text-center">
          <blockquote className="text-2xl font-medium leading-relaxed text-white sm:text-3xl">
            “{featured.quote}”
          </blockquote>
          <figcaption className="mt-6 text-sm text-slate-400">
            <span className="font-semibold text-slate-100">{featured.author}</span>
            <span className="mx-2" aria-hidden="true">•</span>
            {featured.role}
          </figcaption>
        </figure>

        <div className="mt-14 grid gap-8 border-t border-slate-200/15 pt-10 md:grid-cols-2">
          {supporting.slice(0, 2).map((testimonial) => (
            <figure key={`${testimonial.author}-${testimonial.role}`}>
              <blockquote className="text-lg leading-relaxed text-slate-200">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm text-slate-400">
                <span className="font-semibold text-white">{testimonial.author}</span>, {testimonial.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}