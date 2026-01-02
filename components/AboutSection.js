import React from 'react';

export default function AboutSection() {
  return (
    <section id="about" tabIndex={-1} className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-8">
          Who Am I
        </h2>

        <div className="max-w-none">
          <p className="leading-relaxed opacity-90 mb-6">
            I'm an IT professional with 20+ years in the technology industry. My career spans game
            development, enterprise CMS implementations, and government digital transformation.
          </p>

          <p className="leading-relaxed opacity-90 mb-6">
            I lead with empathy and clarity, creating psychological safety, aligning stakeholders, and helping teams
            focus on outcomes. I care deeply about Agile values and principles: transparency, collaboration,
            sustainable pace, and continuous improvement.
          </p>

          <p className="leading-relaxed opacity-90">
            I've worked across studios and organisations in Aotearoa New Zealand and beyond, supporting teams to
            deliver meaningful change, whether that's shipping products, modernising platforms, or improving how work
            flows from idea to delivery. Outside of work, I like to prototype video game ideas and explore new technology.
            I also write thriller novels, including "The Dark That Dwells Beneath Te Aro",
            available on Amazon, Spotify, and Audible.
          </p>
        </div>
      </div>
    </section>
  );
}
