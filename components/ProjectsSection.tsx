interface SelectedLink {
  name: string;
  url: string;
}

interface StartupProject {
  name: string;
  url: string;
  description: string;
  highlights: string;
  collaborator: SelectedLink;
}

interface PastProject {
  name: string;
  url: string;
  description: string;
}

interface IndependentProduct extends PastProject {
  articleUrl: string;
}

interface WebProject {
  name: string;
  url: string;
  timeframe?: string;
  client: string;
  summary: string;
}

interface GameCredits {
  associateProducer: string[];
  qaLead: string[];
  note: string;
}

interface LinkedInProjects {
  name: string;
  url: string;
  description: string;
}

interface SelectedWork {
  startup: StartupProject;
  independentProduct: IndependentProduct;
  pastProjects: PastProject[];
  webProjects: WebProject[];
  gameCredits: GameCredits;
  linkedinProjects: LinkedInProjects;
}

const selectedWork: SelectedWork = {
  startup: {
    name: 'Metaport',
    url: 'https://getmetaport.com/',
    description: 'Bootstrapped product co-founded to streamline portfolio maintenance risk management.',
    highlights: 'Providing product strategy, delivery leadership, and platform build.',
    collaborator: {
      name: 'Russ Michell',
      url: 'https://www.linkedin.com/in/theruss/',
    },
  },
  independentProduct: {
    name: 'repowatch.io',
    url: 'https://repowatch.io/',
    articleUrl: '/blog/why-i-built-repowatch',
    description: 'Created and shipped a lightweight SaaS that gives teams a fast, practical view of code quality, test confidence, security basics, and AI-risk signals across their repositories.',
  },
  pastProjects: [
    {
      name: 'Sidekick Modular Character Creator (Synty Studios)',
      url: 'https://syntystore.com/collections/sidekick-character-packs',
      description: 'Producer role focused on shaping the product delivery model, aligning art and technical workflows, coordinating external partners, and planning the roadmap and releases.',
    },
  ],
  webProjects: [
    {
      name: 'Climate Data for the Environment Services Client (CliDEsc)',
      url: 'https://niwa.co.nz/pacific/climate-data-environment-services-client-clidesc',
      client: 'NIWA',
      summary: 'Silverstripe CMS and product-generator platform helping Pacific climate services turn raw data into time series, maps, and tables.',
    },
    {
      name: 'Public Trustee of Queensland DXP',
      url: 'https://www.pt.qld.gov.au/',
      timeframe: 'Jan 2024',
      client: 'Public Trustee of Queensland',
      summary: 'Squiz DXP migration and digital experience platform rebuild.',
    },
    {
      name: 'NZTA Crash Analysis System (CAS)',
      url: 'https://cas.nzta.govt.nz/',
      timeframe: 'Jun 2018',
      client: 'NZ Transport Agency - Waka Kotahi',
      summary: 'Large-scale data migration and government analytics platform delivery.',
    },
    {
      name: 'Life Events Programme (SmartStart)',
      url: 'https://smartstart.services.govt.nz/',
      timeframe: 'Dec 2016',
      client: 'Department of Internal Affairs',
      summary: 'Digital transformation delivery, agile advisory, federated content model.',
    },
    {
      name: 'Land Air Water Aotearoa (LAWA)',
      url: 'https://www.lawa.org.nz/',
      timeframe: 'Dec 2015',
      client: 'Effect',
      summary: 'Nationwide geospatial data platform for local government partners.',
    },
  ],
  gameCredits: {
    associateProducer: [
      'Rugby Challenge (PS3, Xbox 360, PS Vita, PC)',
    ],
    qaLead: [
      'Blood Drive (PS3, Xbox 360)',
      'GripShift (PS3, Xbox 360)',
      'Hot Wheels: Battle Force 5 (Wii)',
      'Jackass: The Game (PSP/PS2)',
      'Madagascar Kartz (PS3/Xbox 360/Wii)',
      'Rugby League 3 (Wii)',
      'Rugby League LIVE (PS3, Xbox 360, PC)',
      'Shatter (PSN, OnLive, PC)',
      'Speed Racer: The Video Game (PS2, Wii)',
      'Star Wars: Clone Wars (PSP, Xbox 360)',
    ],
    note: 'Games shipped at Sidhe (now PikPok), spanning production and QA leadership.',
  },
  linkedinProjects: {
    name: 'LinkedIn projects',
    url: 'https://www.linkedin.com/in/lukepercy/details/projects/',
    description: 'More delivery case studies, platform work, and portfolio notes.',
  },
};

export default function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-autumn-orange">Selected work</p>
          <h2 id="projects-heading" className="text-3xl font-bold text-white sm:text-4xl">Products, platforms, and teams moved forward</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">
            Delivery work across portfolio products, public digital services, and interactive entertainment.
          </p>
        </div>
        <div>

          <div className="grid grid-cols-1 gap-0 border-y border-slate-200/15 md:grid-cols-2">
            <article className="border-b border-slate-200/15 py-8 md:col-span-2 md:py-10">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Metaport</h3>
                <p className="text-xs text-slate-400 mb-3">Startup venture</p>
                <p className="text-slate-300 mb-3">
                  {selectedWork.startup.description} {selectedWork.startup.highlights}{' '}
                  In collaboration with{' '}
                  <a
                    href={selectedWork.startup.collaborator.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 transition-colors"
                    aria-label="Open Russ Michell LinkedIn profile"
                  >
                    {selectedWork.startup.collaborator.name}
                  </a>
                  .
                </p>
                <a
                  href={selectedWork.startup.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 underline decoration-slate-500 underline-offset-4 transition-colors hover:text-white hover:decoration-autumn-orange"
                  aria-label={`Visit ${selectedWork.startup.name} website`}
                >
                  Visit Metaport
                </a>

                <div className="mt-8 border-t border-slate-200/15 pt-8">
                  <h3 className="text-xl font-bold text-white mb-2">{selectedWork.independentProduct.name}</h3>
                  <p className="text-xs text-slate-400 mb-3">Created and shipped</p>
                  <p className="text-slate-300 mb-3">{selectedWork.independentProduct.description}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    <a
                      href={selectedWork.independentProduct.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-200 underline decoration-slate-500 underline-offset-4 transition-colors hover:text-white hover:decoration-autumn-orange"
                      aria-label={`Visit ${selectedWork.independentProduct.name} website`}
                    >
                      Visit repowatch.io
                    </a>
                    <a
                      href={selectedWork.independentProduct.articleUrl}
                      className="text-slate-200 underline decoration-slate-500 underline-offset-4 transition-colors hover:text-white hover:decoration-autumn-orange"
                    >
                      Read why I built it
                    </a>
                  </div>
                </div>
              </div>
            </article>

            <article className="border-b border-slate-200/15 py-8 md:col-span-2 md:py-10">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Game Credits</h3>
                <p className="text-slate-300 mb-5">{selectedWork.gameCredits.note}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Associate Producer</h4>
                    <ul className="space-y-1 text-slate-300 text-sm">
                      {selectedWork.gameCredits.associateProducer.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Quality Assurance Lead</h4>
                    <ul className="text-slate-300 text-sm columns-1 sm:columns-2 gap-6">
                      {selectedWork.gameCredits.qaLead.map((item) => (
                        <li key={item} className="break-inside-avoid mb-1">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
            <article className="border-b border-slate-200/15 py-8 md:border-b-0 md:border-r md:border-slate-200/15 md:p-10 md:pl-0">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">More Projects</h3>
                <p className="text-slate-300 mb-4">
                  Selected production and delivery work across interactive entertainment and digital products.
                </p>
                <ul className="space-y-4 text-slate-300">
                  {selectedWork.pastProjects.map((project) => (
                    <li key={project.url}>
                      <div className="font-medium text-white">{project.name}</div>
                      <div className="text-slate-300">{project.description}</div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-200 underline decoration-slate-500 underline-offset-4 transition-colors hover:text-white hover:decoration-autumn-orange"
                        aria-label={`View project: ${project.name}`}
                      >
                        View project
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-slate-300 mb-3">{selectedWork.linkedinProjects.description}</p>
                <a
                  href={selectedWork.linkedinProjects.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 underline decoration-slate-500 underline-offset-4 transition-colors hover:text-white hover:decoration-autumn-orange"
                  aria-label="Explore projects on LinkedIn"
                >
                  Explore projects on LinkedIn
                </a>
              </div>
            </article>

            <article className="py-8 md:p-10 md:pr-0">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Large Web Platforms</h3>
                <p className="text-slate-300 mb-4">
                  Government and public-sector platforms delivered with multi-agency stakeholders.
                </p>
                <ul className="space-y-4 text-slate-300">
                  {selectedWork.webProjects.map((project) => (
                    <li key={project.url}>
                      <div className="font-medium text-white">{project.name}</div>
                      <div className="text-xs text-slate-400 mb-1">
                        {project.timeframe ? `${project.timeframe} • ` : ''}{project.client}
                      </div>
                      <div className="text-slate-300">{project.summary}</div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-200 underline decoration-slate-500 underline-offset-4 transition-colors hover:text-white hover:decoration-autumn-orange"
                        aria-label={`View platform: ${project.name}`}
                      >
                        View platform
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>

      </div>
    </section>
  );
}