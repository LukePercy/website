import React from "react";
import { customLoader } from "../loader";
import Image from "next/image";

export default function FavouriteProjects() {
  return (
    <section aria-label="my latest projects" className="relative -mt-20">
      <div className="bg-[#F1F1F1] dark:bg-gray-900">
        <div className="max-w-7xl mx-auto reveal">
          <header className="flex flex-col md:flex-row justify-between items-center xsm:pt-5 md:my-10 lg:my-10">
            <h2 className="text-6xl lg:text-9xl max-w-lg font-bold text-gray-500 my-20 md:my-10 md:text-gray-500 dark:text-gray-300 text-left">
              Create.
            </h2>
          </header>
          <div className="grid md:grid-cols-4 gap-8 lg:-mt-8 pb-40 md:pb-20 sm:pb-5">
            <a
              href="/wip/gettingdiceytc"
              target="_blank"
              className="md:col-span-2 sm:col-span-2"
            >
              <div className="relative overflow-hidden">
                <Image
                  loader={customLoader}
                  src="/GDTC.webp"
                  alt="Getting Dicey Trading Cards Extension project"
                  width={500}
                  height={500}
                  quality={75}
                  className="block transform hover:scale-125 transition duration-1000 ease-out"
                />
                <h3 className="absolute top-10 left-10 text-gray-50 font-bold text-xl bg-autumn-orange rounded-md px-2">
                  Getting Dicey Trading Cards
                </h3>
              </div>
            </a>
            <a
              href="https://www.amazon.com/dp/B09JVFJKFX"
              className="md:col-span-2 sm:col-span-2"
              target="_blank"
            >
              <div className="relative overflow-hidden">
                <Image
                  loader={customLoader}
                  src="/TheDarkThatDwells.webp"
                  alt="The Dark That Dwells Beneath Te Aro rated 4 stars on Amazon books"
                  width={500}
                  height={500}
                  quality={75}
                  className="block transform hover:scale-125 transition duration-1000 ease-out"
                />
                <h3 className="absolute top-10 left-10 text-gray-50 font-bold text-xl bg-autumn-orange rounded-md px-2">
                  The Dark that Dwells Beneath Te Aro
                </h3>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}