import React from "react";
import userData from "../constants/data";

export default function Wip() {
  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800 dark:text-white">
        <div>
        <a href="/">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg><p>Back</p>
        </a>
        </div>
        <h1 className=" text-5xl md:text-8xl font-bold py-6 text-center md:text-left dark:text-white">
          The Decks of the Hunter
        </h1>
      </div>
      <div className="bg-[#F1F1F1] -mt-10 dark:bg-gray-900 dark:text-white">
        <div className="text-container max-w-6xl mx-auto pt-20">
          <p 
            className="leading-loose text-2xl md:text-4xl font-semibold mx-4"
            style={{ lineHeight: "3rem" }}
            >Content here
          </p>
        </div>
      </div>
    </section>
  );
}
