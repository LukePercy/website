import React, { useState, useEffect } from 'react';

export default function ProjectsSection() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedWork = {
    startup: {
      name: 'Metaport',
      url: 'https://getmetaport.com/',
      description: 'Bootstrapped product co-founded to streamline portfolio delivery.',
      highlights: 'Product strategy, delivery leadership, and platform build.',
      collaborator: {
        name: 'Russ Michell',
        url: 'https://www.linkedin.com/in/theruss/',
      },
    },
    pastProjects: [
      {
        name: 'Sidekick Modular Character Creator (Synty Studios)',
        url: 'https://syntystore.com/collections/sidekick-character-packs',
        description: 'Producer role spanning roadmap, external partners, and releases.',
      },
    ],
    webProjects: [
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const [githubResult, gitlabResult] = await Promise.allSettled([
        fetch('/api/github/repos').then(async (r) => {
          if (!r.ok) throw new Error('GitHub request failed');
          const data = await r.json();
          return (data.repos || []).map((repo) => ({ ...repo, source: 'github' }));
        }),
        fetch('/api/gitlab/repos').then(async (r) => {
          if (!r.ok) throw new Error('GitLab request failed');
          const data = await r.json();
          return data.repos || [];
        }),
      ]);

      const githubRepos = githubResult.status === 'fulfilled' ? githubResult.value : [];
      const gitlabRepos = gitlabResult.status === 'fulfilled' ? gitlabResult.value : [];

      const combined = [...githubRepos, ...gitlabRepos];

      if (combined.length === 0) {
        throw new Error('No repositories found');
      }

      setRepos(combined);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Personal Projects
          </h2>
          <div className="text-center text-slate-300">
            Loading projects...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Personal Projects
          </h2>
          <div className="text-center text-red-400">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-6">Selected Work</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-700/50 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-slate-700/50">
              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-2">Metaport</h4>
                <p className="text-xs text-slate-400 mb-3">Startup venture</p>
                <p className="text-slate-300 mb-3">
                  {selectedWork.startup.description} {selectedWork.startup.highlights}{' '}
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
                  className="text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 transition-colors break-all"
                  aria-label={`Open ${selectedWork.startup.name} website`}
                >
                  {selectedWork.startup.url}
                </a>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-slate-700/50">
              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-2">Past Projects</h4>
                <p className="text-slate-300 mb-4">
                  Selected production and delivery work across games and digital products.
                </p>
                <ul className="space-y-4 text-slate-300">
                  {selectedWork.pastProjects.map((p) => (
                    <li key={p.url}>
                      <div className="font-medium text-white">{p.name}</div>
                      <div className="text-slate-300">{p.description}</div>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 transition-colors break-all"
                        aria-label={`Open ${p.name}`}
                      >
                        {p.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-2 bg-slate-700/50 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-slate-700/50">
              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-2">Game Credits</h4>
                <p className="text-slate-300 mb-5">{selectedWork.gameCredits.note}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="font-semibold text-white mb-2">Associate Producer</div>
                    <ul className="space-y-1 text-slate-300 text-sm">
                      {selectedWork.gameCredits.associateProducer.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="font-semibold text-white mb-2">Quality Assurance Lead</div>
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
            </div>

            <div className="bg-slate-700/50 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-slate-700/50">
              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-2">Large Web Platforms</h4>
                <p className="text-slate-300 mb-4">
                  Government and public-sector platforms delivered with multi-agency stakeholders.
                </p>
                <ul className="space-y-4 text-slate-300">
                  {selectedWork.webProjects.map((project) => (
                    <li key={project.url}>
                      <div className="font-medium text-white">{project.name}</div>
                      <div className="text-xs text-slate-400 mb-1">
                        {project.timeframe} • {project.client}
                      </div>
                      <div className="text-slate-300">{project.summary}</div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 transition-colors break-all"
                        aria-label={`Open ${project.name}`}
                      >
                        {project.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-slate-700/50">
              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-2">More</h4>
                <p className="text-slate-300 mb-3">{selectedWork.linkedinProjects.description}</p>
                <a
                  href={selectedWork.linkedinProjects.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-200 underline decoration-slate-500 hover:text-white hover:decoration-slate-200 transition-colors break-all"
                  aria-label="Open LinkedIn projects"
                >
                  {selectedWork.linkedinProjects.url}
                </a>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-white mb-12">
          My Code
        </h2>

        <p className="text-slate-300 mb-10 max-w-3xl">
          These are my personal repositories and experiments on GitHub and GitLab.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <div
              key={`${repo.source || 'github'}-${repo.id}`}
              className="bg-slate-700/50 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden backdrop-blur-sm h-full flex flex-col"
            >
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">
                  {repo.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  {repo.source === 'gitlab' ? 'GitLab' : 'GitHub'}
                </p>
                <p className="text-slate-300 mb-4 line-clamp-3">
                  {repo.description || 'No description available'}
                </p>

                <div className="mt-auto">
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-autumn-orange"></span>
                        {repo.language}
                      </span>
                    )}
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${repo.name} on ${repo.source === 'gitlab' ? 'GitLab' : 'GitHub'}`}
                    className="inline-block px-4 py-2 bg-slate-100 hover:bg-white text-slate-900 rounded-lg text-sm font-medium transition-colors"
                  >
                    View on {repo.source === 'gitlab' ? 'GitLab' : 'GitHub'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {repos.length === 0 && (
          <div className="text-center text-slate-300">
            No projects found
          </div>
        )}
      </div>
    </section>
  );
}
