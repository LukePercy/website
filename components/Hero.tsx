import { PERSON_NAME } from '../lib/site';
import ContactButton from './ContactButton';

export default function Hero() {
  return (
    <section
      aria-labelledby="home-heading"
      className="flex min-h-[calc(100vh-5rem)] items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)] lg:gap-16">
        <div className="text-left">
          <h1 id="home-heading" className="text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-6xl">
            <span className="mb-6 block text-sm font-medium uppercase leading-normal tracking-widest text-autumn-orange">
              Kia ora, I'm {PERSON_NAME}
            </span>
            <span>I help organisations turn complex digital delivery into clear, confident progress.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            Delivery leadership, digital advisory, and product experience shaped by more than 20 years across
            government platforms, enterprise technology, and interactive entertainment.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#projects"
              className="inline-block rounded-md bg-white px-7 py-3 text-center font-medium text-slate-900 shadow-lg transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-autumn-orange focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              View selected work
            </a>
            <ContactButton className="inline-block rounded-md border border-slate-400 px-7 py-3 text-center font-medium text-white transition-colors hover:border-white hover:bg-slate-800/40 focus-visible:ring-2 focus-visible:ring-autumn-orange focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
              Get in touch
            </ContactButton>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-slate-200/20 bg-slate-800/45 shadow-2xl">
            <img
              src="/lpercy.jpg"
              alt={`${PERSON_NAME} overlooking the Minato-ohashi Bridge in Osaka`}
              width="720"
              height="960"
              fetchPriority="high"
              className="h-full w-full object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-4 rounded-md border border-white/15" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-autumn-orange" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}