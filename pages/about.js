import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout 
      title="About | Portfolio"
      description="Learn more about me, my experience, and skills"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About Me
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Agile Project Manager, Author, Technology Leader
          </p>
        </div>

        {/* Bio Section */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Hello, I'm Luke Percy
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            I'm an experienced Agile Project Manager with over 20 years in the technology sector, 
            specializing in game development, enterprise CMS platforms, and government digital services. 
            Throughout my career, I've had the privilege of working on diverse projects that have shaped 
            my approach to delivering value through agile methodologies.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            My gaming career includes leadership roles at prominent studios like Sidhe (now PikPok) and 
            Synty Studios, where I contributed to the success of titles such as Jonah Lomu Rugby Challenge, 
            Shatter, and Star Wars: Clone Wars. In the enterprise and government space, I've led multimillion-dollar 
            CMS implementations using Umbraco, Drupal, Silverstripe, and Squiz DXP, including the Department of 
            Internal Affairs Common Web Platform.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Beyond technology, I'm also an author. My book, "The Dark That Dwells Beneath Te Aro," is available 
            as both print and audiobook on Amazon, Spotify, and Audible, earning 4.5 stars from readers. This 
            creative outlet complements my technical work and reflects my belief in diverse skill development.
          </p>
        </div>

        {/* Skills Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Expertise & Certifications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Agile/Scrum',
              'Kanban',
              'Umbraco',
              'Drupal',
              'Silverstripe',
              'Squiz DXP',
              'Game Production',
              'CMS Strategy',
              'Team Leadership',
              'Scrum Alliance CSM',
              'ICAgile Certified',
              'Scrum.org PSM'
            ].map((skill) => (
              <div 
                key={skill}
                className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg text-center font-medium text-gray-900 dark:text-white"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Career Highlights
          </h2>
          <div className="space-y-8">
            <div className="border-l-4 border-autumn-orange pl-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Agile Project Manager
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Various Organizations • 2005 - Present
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Led agile transformation and project delivery across gaming, government, and enterprise sectors. 
                Delivered 100+ projects including the NZTA Security Development Lifecycle Tool and Department of 
                Internal Affairs Common Web Platform.
              </p>
            </div>
            
            <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Game Development Leadership
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Sidhe (PikPok) & Synty Studios • 2000s - 2010s
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Managed production of 15+ game titles across console, PC, and mobile platforms including 
                Jonah Lomu Rugby Challenge, Shatter, and Star Wars: Clone Wars. Coordinated multi-platform 
                releases and publisher relationships.
              </p>
            </div>
            
            <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Author
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Published Work • 2020s
            Looking for an experienced Agile Project Manager or have a project in mind?
          </p>
          <a 
            href="mailto:luke@lukepercynt and audiobook formats on Spotify and Audible
              <p className="text-gray-600 dark:text-gray-400">
                Built and maintained full-stack applications. Worked with Node.js, 
                Express, and various frontend frameworks.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-autumn-orange to-orange-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Let's Work Together
          </h2>
          <p className="text-white/90 mb-6">
            Interested in collaborating or have a project in mind?
          </p>
          <a 
            href="mailto:lpercy@ljpercy.com"
            className="inline-block px-8 py-3 bg-white text-autumn-orange rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </Layout>
  );
}
