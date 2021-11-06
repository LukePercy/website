import React from "react";
// import Link from "next/link";

export default function FavouriteProjects() {
  return (
    <div className="bg-[#F1F1F1] -mt-20 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center pt-0 mx-0 md:my-0 lg:my-10">
          <h1 className="text-6xl lg:text-9xl max-w-lg font-bold text-gray-500 my-20 md:my-10 md:text-white dark:text-gray-600 text-left">
            Create.
          </h1>
        </header>

        {/* Grid starts here */}
        <div className="grid md:grid-cols-4 gap-8 lg:-mt-8 pb-40">
          {/* Single card */}
          <a
            href="https://www.twitch.tv/gettingdicey"
            target="_blank"
            className="w-full block col-span-2 shadow-2xl"
          >
            <div className="relative overflow-hidden">
              <img
                src="/GDTC.png"
                alt="Getting Dicey Trading Cards Extension project"
                className="transform hover:scale-125 transition duration-1000 ease-out"
              />
              <h1 className="absolute top-10 left-10 text-gray-50 font-bold text-xl bg-red-500 rounded-md px-2">
                Getting Dicey Trading Cards
              </h1>
              <h1 className="absolute bottom-10 left-10 text-gray-50 font-bold text-xl">
                01
              </h1>
            </div>
          </a>
          {/* Single card */}
          <a
            href="https://www.amazon.com/Dark-that-Dwells-Beneath-Aro-ebook/dp/B092S7YPT6"
            className="w-full block col-span-3 sm:col-span-2 shadow-2xl"
            target="_blank"
          >
            <div className="relative overflow-hidden">
              {/* <div className="overlay absolute inset-0 bg-black bg-opacity-70 z-10"></div> */}
              <img
                src="/TheDarkThatDwells.jpg"
                alt="The Dark That Dwells Beneath Te Aro rated 4 stars on Amazon books"
                className="transform hover:scale-125 transition duration-1000 ease-out"
              />
              <h1 className="absolute top-10 left-10 text-gray-50 font-bold text-xl bg-red-500 rounded-md px-2">
                The Dark that Dwells Beneath Te Aro
              </h1>
              <h1 className="absolute bottom-10 left-10 text-gray-50 font-bold text-xl">
                02
              </h1>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
