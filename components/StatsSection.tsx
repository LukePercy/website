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
    <section className="py-20 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">Key statistics</h2>
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center flex flex-col-reverse items-center">
              <dt className="text-sm sm:text-base text-slate-300">
                {stat.label}
              </dt>
              <dd className="text-5xl sm:text-6xl font-bold text-white mb-2">
                {stat.number}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}