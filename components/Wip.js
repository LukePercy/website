import React from "react";

export default function Wip() {
  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800 dark:text-white">
        <h1 className=" text-5xl md:text-6xl xsm:text-2xl font-bold py-6 text-left dark:text-white">
          The Decks of the Hunter. <span className="block text-lg md:text-2xl md:text-left dark:text-white">(working title)</span>
        </h1>
      </div>
      <div className="bg-[#F1F1F1] -mt-10 dark:bg-gray-900 dark:text-white">
        <div className="text-container max-w-6xl mx-auto pt-20 xsm:pt-10">
          <p 
            className="leading-relaxed text-2xl md:text-4xl sm:text-2xl xsm:text-base font-semibold mx-4"
            style={{ lineHeight: "3rem" }}
            >Since the events of <a className="hover:text-purple-500 underline" href="https://www.amazon.com/Dark-that-Dwells-Beneath-Aro-ebook/dp/B092S7YPT6">The Dark that Dwells Beneath Te Aro</a>, 
            investigative journalist Benton Bright tries to recover from his encounter with the Wellington Philosophical Society and the discovery of the book of Abzu.  
          </p>
        </div>
      </div>
    </section>
  );
}
