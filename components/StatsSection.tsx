interface Stat {
  number: string;
  label: string;
}

const stats: Stat[] = [
  {
    number: '20+',
    label: 'Years in Tech',
  },
  {
    number: '15+',
    label: 'Major Game Titles',
  },
  {
    number: '$50M+',
    label: 'Revenue generated',
  },
  {
    number: '140+',
    label: 'Web and Digital Projects',
  },
];

export default function StatsSection() {
  return (
    <section aria-labelledby="statistics-heading" className="border-y border-slate-200/10 py-12 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 id="statistics-heading" className="sr-only">Key statistics</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse items-center text-center">
              <dt className="mt-1 text-sm text-slate-300 sm:text-base">
                {stat.label}
              </dt>
              <dd className="text-4xl font-bold text-white sm:text-5xl">
                {stat.number}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}