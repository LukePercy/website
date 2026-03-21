interface Company {
  name: string;
  url: string | null;
}

const companies: Company[] = [
  { name: 'Squiz', url: 'https://squiz.net/' },
  { name: 'Synty Studios', url: 'https://www.syntystudios.com/' },
  { name: 'Catalyst IT', url: 'https://www.catalyst.net.nz/' },
  { name: 'Effect', url: 'https://effect.nz/' },
  { name: 'Stripe the Web', url: null },
  { name: 'Silverstripe', url: 'https://www.silverstripe.com/' },
  { name: 'PikPok', url: 'https://pikpok.com/' },
  { name: 'Sidhe', url: 'https://www.sidhe.co.nz/' },
  { name: 'Manga Entertainment NZ', url: 'https://manga.co.nz/' },
];

export default function CompaniesMarqueeSection() {
  return (
    <section className="py-16 bg-slate-800/30" aria-label="Companies I have worked with">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="sr-only">
          {companies.map((company) => (
            <li key={company.name}>
              {company.url ? (
                <a href={company.url} target="_blank" rel="noopener noreferrer">
                  {company.name}
                </a>
              ) : (
                company.name
              )}
            </li>
          ))}
        </ul>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...companies, ...companies].map((company, index) => {
              const content = (
                <span className="px-4 py-2 text-slate-200 whitespace-nowrap">
                  {company.name}
                </span>
              );

              return (
                <div key={`${company.name}-${index}`} className="marquee-item">
                  {company.url ? (
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white focus-visible:ring-2 focus-visible:ring-autumn-orange rounded-full"
                      aria-label={`Open ${company.name}`}
                      tabIndex={-1}
                    >
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}