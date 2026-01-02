import React from 'react';

export default function CompaniesMarqueeSection() {
    const companies = [
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

    return (
        <section className="py-16 bg-slate-800/30" aria-label="Companies I have worked with">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Screen reader-friendly list */}
                <ul className="sr-only">
                    {companies.map((c) => (
                        <li key={c.name}>
                            {c.url ? (
                                <a href={c.url} target="_blank" rel="noopener noreferrer">
                                    {c.name}
                                </a>
                            ) : (
                                c.name
                            )}
                        </li>
                    ))}
                </ul>

                {/* Marquee */}
                <div className="marquee" aria-hidden="true">
                    <div className="marquee-track">
                        {[...companies, ...companies].map((c, idx) => {
                            const content = (
                                <span className="px-4 py-2 text-slate-200 whitespace-nowrap">
                                    {c.name}
                                </span>
                            );

                            return (
                                <div key={`${c.name}-${idx}`} className="marquee-item">
                                    {c.url ? (
                                        <a
                                            href={c.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-white focus-visible:ring-2 focus-visible:ring-autumn-orange rounded-full"
                                            aria-label={`Open ${c.name}`}
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
