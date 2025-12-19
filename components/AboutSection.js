import React from 'react';

export default function AboutSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Who Am I
        </h2>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            I'm an experienced Agile Project Manager with over 20 years in the technology industry. 
            My career spans game development, enterprise CMS implementations, and government digital 
            transformation projects. I've led teams at major studios like Sidhe (now PikPok) and Synty Studios, 
            shipping titles like Jonah Lomu Rugby Challenge, Shatter, and Star Wars: Clone Wars.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Beyond gaming, I specialize in CMS platforms including Umbraco, Drupal, Silverstripe, and Squiz DXP. 
            I've delivered significant government projects like the Department of Internal Affairs Common Web 
            Platform and the NZTA Security Development Lifecycle Tool, saving organizations substantial costs 
            while improving delivery outcomes.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            I hold certifications from Scrum Alliance, ICAgile, and Scrum.org. When I'm not managing projects, 
            I write—I'm the author of "The Dark That Dwells Beneath Te Aro," available on Amazon, Spotify, and Audible. 
            I'm passionate about helping teams deliver value through agile practices and strategic project management.
          </p>
        </div>
      </div>
    </section>
  );
}
