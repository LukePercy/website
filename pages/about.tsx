import Layout from '../components/Layout';
import ContactButton from '../components/ContactButton';
import { getAbsoluteUrl, getSiteUrl, PERSON_NAME, PERSON_SAME_AS } from '../lib/site';

const skills = [
  'BA in Information Technology',
  'Agile/Scrum',
  'Kanban',
  'OKRs and KPIs',
  'Project Health Reporting',
  'Risk Registers',
  'RACI and Governance',
  'Portfolio Planning',
  'Umbraco',
  'Drupal',
  'Silverstripe',
  'Squiz DXP',
  'Game Production',
  'CMS Strategy',
  'Team Leadership',
  'Scrum Alliance CSM',
  'ICAgile Certified',
  'Scrum.org PSM',
  'Prince2 Foundation (PMI)',
  'PMP Foundation (PMI)',
];

export default function About() {
  const title = 'About | Portfolio';
  const description = 'Learn more about my delivery leadership, programme management, governance practice, and experience across digital transformation, CMS platforms, and game development.';
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
        'Project health measures',
        'OKRs',
        'KPIs',
        'RACI models',
        'Risk registers',
        'Portfolio allocation data capture',
        'Delivery governance',
        'Digital transformation',
      ],
    },
  };

  return (
    <Layout
      title={title}
      description={description}
      schema={schema}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            About Me
          </h1>
          </div>

        <div className="prose prose-lg prose-invert max-w-none mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Hello, I'm Luke Percy
          </h2>
          <p className="text-slate-300 mb-4">
            I'm an experienced Delivery Lead with over 20 years in the technology sector,
            specialising in game development, enterprise CMS platforms, and government digital services.
            I lead with empathy and clarity, creating psychological safety while helping teams deliver value
            through agile ways of working, practical governance, and clear reporting for leadership.
          </p>
          <p className="text-slate-300 mb-4">
            My gaming career includes leadership roles at prominent studios like Sidhe (now PikPok) and
            Synty Studios, where I contributed to the success of titles such as Jonah Lomu Rugby Challenge,
            Shatter, and Star Wars: Clone Wars. In the enterprise and government space, I've led multimillion-dollar
            CMS implementations using Umbraco, Drupal, Silverstripe, and Squiz DXP, including the Department of
            Internal Affairs Common Web Platform.
          </p>
          <p className="text-slate-300 mb-4">
            Colleagues describe my leadership style as supportive and people-first. I prioritise coaching,
            clear communication, and enabling teams to deliver sustainably. In practice, that means using
            delivery measures such as estimation, velocity, OKRs, KPIs, RACI models, risk registers, and
            portfolio allocation data to turn delivery signals into decisions that teams, senior management,
            and executive stakeholders can act on.
          </p>
          <p className="text-slate-300 mb-4">
            Beyond technology, I'm also an author. My book, "The Dark That Dwells Beneath Te Aro," is available
            as both print and audiobook on Amazon, Spotify, and Audible, earning 4.5 stars from readers. This
            creative outlet complements my technical work and reflects my belief in diverse skill development.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">
            Expertise & Certifications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill}
                className="bg-slate-800/50 px-4 py-3 rounded-lg text-center font-medium border border-slate-700/50 hover:border-slate-500/60 transition-colors"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">
            Delivery Practice in Action
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                Project health measures
              </h3>
              <p className="text-slate-300">
                I use project health measures to make delivery status visible early: scope confidence, schedule confidence,
                dependency pressure, team capacity, budget position, and decision latency. That gives leaders a realistic
                picture of delivery health before issues become escalations.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                OKRs and KPIs
              </h3>
              <p className="text-slate-300">
                I connect delivery plans to OKRs and KPIs so teams are not just shipping outputs, but moving measurable
                outcomes. I use those measures to help management track progress, challenge assumptions, and reset priorities
                when value is drifting.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                RACI and governance clarity
              </h3>
              <p className="text-slate-300">
                I use RACI models to clarify who is responsible, accountable, consulted, and informed across delivery,
                architecture, content, and executive decision-making. That reduces ambiguity, speeds up approvals, and
                helps cross-functional teams move with confidence.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                Risk registers and portfolio data
              </h3>
              <p className="text-slate-300">
                I maintain risk registers and portfolio allocation data capture to surface delivery risk, investment mix,
                and capacity constraints. That supports better prioritisation, stronger governance conversations, and a more
                credible view of what the organisation can deliver next.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">
            Career Highlights
          </h2>
          <div className="space-y-8">
            <div className="border-l-4 border-autumn-orange pl-6">
              <h3 className="text-xl font-bold mb-2">
                Agile Project Manager
              </h3>
              <p className="text-slate-400 mb-2">
                Various Organisations • 2005 - Present
              </p>
              <p className="text-slate-300">
                Led agile transformation and project delivery across gaming, government, and enterprise sectors.
                Delivered 100+ projects including the NZTA Security Development Lifecycle Tool and Department of
                Internal Affairs Common Web Platform. Built practical governance rhythms using OKRs, KPIs, delivery
                health reporting, RAID and risk registers, and portfolio visibility to support informed leadership decisions.
              </p>
            </div>

            <div className="border-l-4 border-slate-400 pl-6">
              <h3 className="text-xl font-bold mb-2">
                Game Development Leadership
              </h3>
              <p className="text-slate-400 mb-2">
                Sidhe (PikPok) & Synty Studios • 2000s - 2010s
              </p>
              <p className="text-slate-300">
                Managed production of 15+ game titles across console, PC, and mobile platforms. Served as
                a Producer on Jonah Lomu Rugby Challenge and QA Lead on titles including Shatter, Speed Racer: The Videogame, and
                Star Wars: Clone Wars. Coordinated multi-platform releases and publisher relationships.
              </p>
            </div>

            <div className="border-l-4 border-slate-400 pl-6">
              <h3 className="text-xl font-bold mb-2">
                Author
              </h3>
              <p className="text-slate-400 mb-2">
                Published Work • 2020s
              </p>
              <p className="text-slate-300">
                Published "The Dark That Dwells Beneath Te Aro" in print and audiobook formats on Amazon,
                Spotify and Audible, earning 4.5 stars from readers.
              </p>
              <p className="text-slate-300 mt-4">
                Senior Writer • NZGamer.com • 2011 - 2012
              </p>
              <p className="text-slate-300">
                As a writer for NZGamer.com I provide video game reviews, features on trade shows and events,
                and interviews with some of the best creatives in the industry for over 2 million readers.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4">
            Let's Work Together
          </h2>
          <p className="text-slate-200 mb-6">
            Interested in collaborating or have a project in mind?
          </p>
          <ContactButton className="inline-block px-8 py-3 bg-slate-100 hover:bg-white text-slate-900 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
            Get in Touch
          </ContactButton>
        </div>
      </div>
    </Layout>
  );
}