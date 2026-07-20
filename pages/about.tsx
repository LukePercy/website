import Layout from '../components/Layout';
import { getAbsoluteUrl, getSiteUrl, PERSON_NAME, PERSON_SAME_AS } from '../lib/site';

const expertise = [
  {
    title: 'Delivery leadership and governance',
    items: 'Portfolio planning, project health, OKRs and KPIs, RAID, RACI, capacity, dependencies, and executive reporting',
  },
  {
    title: 'Platforms and sectors',
    items: 'Government digital services, CMS and DXP delivery, data platforms, SaaS products, and interactive entertainment',
  },
  {
    title: 'Technology',
    items: 'Squiz DXP, Silverstripe, Umbraco, Drupal, product delivery, and cross-discipline art and technical workflows',
  },
];

const qualifications = [
  'BA in Information Technology',
  'Diploma in Project Management (Level 4), covering PRINCE2, PMBOK, and PMP-aligned practices',
  'Certified ScrumMaster (CSM), Scrum Alliance',
  'Professional Scrum Master (PSM), Scrum.org',
];

export default function About() {
  const title = 'About Luke Percy | Delivery Leader';
  const description = 'Delivery leadership, programme governance, and technical experience across government digital services, enterprise platforms, products, and interactive entertainment.';
  const siteUrl = getSiteUrl();
  const pageUrl = getAbsoluteUrl('/about');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: title,
    description,
    url: pageUrl,
    inLanguage: 'en-NZ',
    mainEntity: {
      '@type': 'Person',
      name: PERSON_NAME,
      url: siteUrl,
      jobTitle: 'Delivery Lead, Programme Manager, and Digital Leader',
      sameAs: PERSON_SAME_AS,
      knowsAbout: [
        'Delivery leadership',
        'Programme governance',
        'Portfolio planning',
        'Executive reporting',
        'Digital transformation',
        'CMS and DXP delivery',
        'Interactive entertainment',
      ],
    },
  };

  return (
    <Layout
      title={title}
      description={description}
      schema={schema}
    >
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <header className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-autumn-orange">About Luke Percy</p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-6xl">
            Delivery leadership for complex digital work
          </h1>
          <p className="mt-7 text-xl leading-relaxed text-slate-200 sm:text-2xl">
            I bring technical fluency, practical governance, and people-first leadership together so teams can
            make sound decisions and keep meaningful work moving amid uncertainty.
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Over more than 20 years in technology, I have worked across government digital services, enterprise
            platforms, products, and interactive entertainment. I am most useful where delivery crosses disciplines,
            priorities compete, and leaders need a credible view of what is happening and what to do next.
          </p>
        </header>

        <section className="mt-20 border-t border-slate-200/15 pt-12" aria-labelledby="evidence-heading">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-autumn-orange">Selected evidence</p>
          <h2 id="evidence-heading" className="text-3xl font-bold text-white sm:text-4xl">Leadership applied to real work</h2>

          <div className="mt-10 divide-y divide-slate-200/15 border-y border-slate-200/15">
            <article className="grid gap-4 py-8 md:grid-cols-[0.7fr_1.3fr] md:gap-10">
              <h3 className="text-xl font-bold text-white">Public digital platforms</h3>
              <p className="leading-relaxed text-slate-300">
                Led delivery and advisory work across services and data platforms including SmartStart, the NZTA
                Crash Analysis System, LAWA, and NIWA's CliDEsc. The work required alignment across agencies,
                technical teams, content, data, and public-service outcomes.
              </p>
            </article>
            <article className="grid gap-4 py-8 md:grid-cols-[0.7fr_1.3fr] md:gap-10">
              <h3 className="text-xl font-bold text-white">Enterprise DXP delivery</h3>
              <p className="leading-relaxed text-slate-300">
                Led CMS and DXP delivery across Umbraco, Drupal, Silverstripe, and Squiz, including the Public
                Trustee of Queensland migration and digital experience platform rebuild. My focus is the delivery
                system around the technology: governance, dependencies, decisions, and stakeholder confidence.
              </p>
            </article>
            <article className="grid gap-4 py-8 md:grid-cols-[0.7fr_1.3fr] md:gap-10">
              <h3 className="text-xl font-bold text-white">Products and interactive entertainment</h3>
              <p className="leading-relaxed text-slate-300">
                Co-founded Metaport, created and shipped repowatch.io, and shaped the product delivery model for
                Synty Studios' Sidekick character platform. Earlier roles at Sidhe included production and QA
                leadership across multi-platform game releases and publisher relationships.
              </p>
            </article>
          </div>

          <a
            href="/#projects"
            className="mt-6 inline-flex rounded-sm font-medium text-white underline decoration-slate-500 underline-offset-4 transition-colors hover:decoration-autumn-orange focus-visible:ring-2 focus-visible:ring-autumn-orange"
          >
            Explore selected work
          </a>
        </section>

        <section className="mt-20" aria-labelledby="leadership-heading">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-autumn-orange">How I lead</p>
          <h2 id="leadership-heading" className="text-3xl font-bold text-white sm:text-4xl">Clarity without unnecessary ceremony</h2>

          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            <article className="border-t border-slate-200/20 pt-6">
              <h3 className="text-xl font-bold text-white">Make delivery legible</h3>
              <p className="mt-4 leading-relaxed text-slate-300">
                When status is fragmented, I bring scope, schedule, capacity, budget, dependencies, risks, and
                decision latency into one honest view so issues surface before they become escalations.
              </p>
            </article>
            <article className="border-t border-slate-200/20 pt-6">
              <h3 className="text-xl font-bold text-white">Turn signals into decisions</h3>
              <p className="mt-4 leading-relaxed text-slate-300">
                I connect delivery plans to outcomes and create clear ownership for decisions. Reporting is useful
                only when teams and leaders can act on it, challenge assumptions, and reset priorities in time.
              </p>
            </article>
            <article className="border-t border-slate-200/20 pt-6">
              <h3 className="text-xl font-bold text-white">Build sustainable systems</h3>
              <p className="mt-4 leading-relaxed text-slate-300">
                I coach, remove blockers, and create space for candid conversations. The goal is not process for its
                own sake, but a delivery environment where people can do strong work without relying on heroics.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-20 border-t border-slate-200/15 pt-12" aria-labelledby="career-heading">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-autumn-orange">Career chapters</p>
          <h2 id="career-heading" className="text-3xl font-bold text-white sm:text-4xl">A career across delivery and technology</h2>

          <div className="mt-10 space-y-10">
            <article className="border-l-2 border-autumn-orange pl-6">
              <h3 className="text-xl font-bold text-white">Digital delivery and programme leadership</h3>
              <p className="mt-2 text-sm text-slate-400">Government, enterprise, and product environments</p>
              <p className="mt-3 max-w-3xl leading-relaxed text-slate-300">
                Leading cross-functional delivery, CMS and DXP programmes, governance rhythms, portfolio visibility,
                risk and dependency management, and decision-ready reporting for senior stakeholders.
              </p>
            </article>
            <article className="border-l-2 border-slate-400 pl-6">
              <h3 className="text-xl font-bold text-white">Interactive entertainment production</h3>
              <p className="mt-2 text-sm text-slate-400">Sidhe (now PikPok) and Synty Studios</p>
              <p className="mt-3 max-w-3xl leading-relaxed text-slate-300">
                Production and QA leadership across console, PC, and mobile releases, followed by product delivery
                work connecting roadmap, external partners, art workflows, technical workflows, and releases.
              </p>
            </article>
            <article className="border-l-2 border-slate-400 pl-6">
              <h3 className="text-xl font-bold text-white">Independent product development</h3>
              <p className="mt-2 text-sm text-slate-400">Metaport and repowatch.io</p>
              <p className="mt-3 max-w-3xl leading-relaxed text-slate-300">
                Applying product strategy and delivery leadership directly: identifying a problem, shaping the
                proposition, building the delivery path, and putting a working product in front of users.
              </p>
            </article>
          </div>

          <a
            href={PERSON_SAME_AS[1]}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-sm font-medium text-white underline decoration-slate-500 underline-offset-4 transition-colors hover:decoration-autumn-orange focus-visible:ring-2 focus-visible:ring-autumn-orange"
          >
            View full career history on LinkedIn
          </a>
        </section>

        <section className="mt-20 border-t border-slate-200/15 pt-12" aria-labelledby="expertise-heading">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-autumn-orange">Expertise</p>
          <h2 id="expertise-heading" className="text-3xl font-bold text-white sm:text-4xl">Practice, platforms, and qualifications</h2>

          <dl className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {expertise.map((group) => (
              <div key={group.title} className="border-t border-slate-200/20 pt-6">
                <dt className="font-semibold text-white">{group.title}</dt>
                <dd className="mt-3 leading-relaxed text-slate-300">{group.items}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 border-t border-slate-200/15 pt-8">
            <h3 className="text-xl font-bold text-white">Qualifications and certifications</h3>
            <ul className="mt-5 grid gap-3 text-slate-300 sm:grid-cols-2">
              {qualifications.map((qualification) => (
                <li key={qualification} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-autumn-orange" />
                  <span>{qualification}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-20 border-t border-slate-200/15 pt-12" aria-labelledby="beyond-heading">
          <div className="grid gap-6 md:grid-cols-[0.7fr_1.3fr] md:gap-10">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-autumn-orange">Beyond delivery</p>
              <h2 id="beyond-heading" className="text-3xl font-bold text-white">Creative work</h2>
            </div>
            <div>
              <p className="text-lg leading-relaxed text-slate-300">
                I wrote for NZGamer.com from 2011 to 2012 and later published the thriller novel
                <span className="text-white"> The Dark That Dwells Beneath Te Aro</span> in print and audiobook
                formats. Writing gives me another way to practise structure, audience awareness, and making complex
                ideas clear.
              </p>
              <a
                href={PERSON_SAME_AS[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex rounded-sm font-medium text-white underline decoration-slate-500 underline-offset-4 transition-colors hover:decoration-autumn-orange focus-visible:ring-2 focus-visible:ring-autumn-orange"
              >
                View my author page
              </a>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}