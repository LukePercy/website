import React from "react";
import userData from "../constants/data";
import Link from "next/link";

export default function AboutMe() {
  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800 dark:text-white">
        <h1 className="text-5xl md:text-9xl font-bold py-6 text-center md:text-left dark:text-white">
          About<span className="text-lg">me.</span>
        </h1>
      </div>
      <div className="bg-[#F1F1F1] -mt-10 dark:bg-gray-900 dark:text-white">
        <div className="text-container max-w-6xl mx-auto pt-20 xsm:pt-10">
          <p
            className="leading-relaxed text-2xl md:text-4xl sm:text-2xl xsm:text-base font-semibold mx-4"
            style={{ lineHeight: "3rem" }}
          >
            {userData.about.title}<br/> I am currently working on {" "}
            <Link href={userData.about.currentProjectUrl}>
            <a
              className="bg-purple-500 rounded-md px-2 py-1 text-white"
            >
              {userData.about.currentProject}
            </a>
            </Link>
          </p>
        </div>
      </div>
      <div className="bg-[#F1F1F1] dark:bg-gray-900 px-4">
        <div className="pt-20 grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-y-20 gap-x-20">
          {/* Social Buttons */}
          <div className="inline-flex flex-col">
            <div>
              <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Contact
              </h1>
              <p className="text-lg text-gray-600 mt-4 dark:text-gray-300">
                You can send me an{" "}
                <a
                  href={`mailto:${userData.email}?subject=email from ljpercy.com`}
                  className="text-gray-800 border-b-2 border-gray-800 dark:border-gray-300 font-bold dark:text-gray-300"
                >
                  email
                </a>{" "}
                and I will do my best to respond.
              </p>
            </div>
            <div className="mt-8">
              <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Job Opportunities
              </h1>
              <p className="text-lg text-gray-600 mt-4 dark:text-gray-300">
                I am currently employed  
                <a 
                href='https://catalyst.net.nz'
                target="_blank"
                className="flex flex-row space-x-4 group"
                >
                  <p className="text-lg text-red-700 relative overflow-hidden dark:text-red-400">
                    <div className="absolute h-0.5 w-full bg-red-500 bottom-0 transform -translate-x-32 group-hover:translate-x-0 transition duration-300"></div>
                    catalyst.net.nz
                  </p>
                </a>
                {/* <a
                  href={userData.resumeUrl}
                  target="__blank"
                  className="text-gray-800 border-b-2 border-gray-800 dark:border-gray-300 font-bold dark:text-gray-300"
                >
                  CV
                </a>{" "}
                and I'd love to work for you. */}
              </p>
            </div>
            {/* Social Links */}
            <h1 className="text-xl font-semibold text-gray-700 mt-8 dark:text-gray-200">
              Social Links
            </h1>
            <div className="mt-4 ml-4">
              <div className="flex flex-row justify-start items-center">
                <a
                  href={userData.socialLinks.twitter}
                  target="_blank"
                  className="flex flex-row items-center space-x-4 group"
                >
                  <div className="my-4">&rarr;</div>
                  <p className="text-lg text-gray-600 font-mono relative overflow-hidden dark:text-gray-300">
                    <div className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></div>
                    Twitter
                  </p>
                </a>
              </div>
              <div className="flex flex-row justify-start items-center">
                <a
                  href={userData.socialLinks.github}
                  target="_blank"
                  className="flex flex-row items-center space-x-4 group"
                >
                  <div className="my-4">&rarr;</div>
                  <p className="text-lg text-gray-600 font-mono relative overflow-hidden dark:text-gray-300">
                    <div className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></div>
                    GitHub
                  </p>
                </a>
              </div>
              <div className="flex flex-row justify-start items-center">
                <a
                  href={userData.socialLinks.linkedin}
                  target="_blank"
                  className="flex flex-row items-center space-x-4 group"
                >
                  <div className="my-4">&rarr;</div>
                  <p className="text-lg text-gray-600 font-mono relative overflow-hidden dark:text-gray-300">
                    <div className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></div>
                    LinkedIn
                  </p>
                </a>
              </div>
            </div>
          </div>
          {/* Text area */}
          <div className="col-span-1 md:col-span-2">
            {userData.about.description?.map((desc, idx) => (
              <p
                key={idx}
                className="text-xl text-gray-700 mb-4 dark:text-gray-300 "
              >
                {desc}
              </p>
            ))}

            <h1 className="text-3xl rounded-md px-2 py-1 inline-block font-bold">
              I love working with the following tech
            </h1>
            <div className="flex flex-row flex-wrap mt-8">
              <img
                src='/javascript.png'
                className="h-20 w-20 mx-4 my-4"
                alt="javascript"
              />
              <img
                src="/typescript.png"
                className="h-20 w-20 mx-4 my-4"
                alt="Typescript"
              />
              <img
                src="/html.png"
                className="h-20 w-20 mx-4 my-4"
                alt="HTML"
              />
              <img
                src="/css.png"
                className="h-20 w-20 mx-4 my-4"
                alt="CSS"
              />
               <img
                src="/GitHub-Mark-64px.png"
                className="h-20 w-20 mx-4 my-4"
                alt="Git and GitHub"
              />
              <img
                src="/react.png"
                className="h-20 w-20 mx-4 my-4"
                alt="ReactJS"
              />
              <img
                src="/mongodb.png"
                className="h-20 w-20 mx-4 my-4"
                alt="MongoDB and NoSQL Databases"
              />
              <img
                src="/umbraco_logo_blue1.png"
                className="h-20 w-20 mx-4 my-4"
                alt="Umbraco CMS"
              />
              <img
                src="/ss-opensource.png"
                className="h-10 w-15 mx-4 my-8"
                alt="Silverstripe CMS and framework"
              />
              <img
                src="/drupal-wordmark.png"
                className="h-10 w-15 mx-4 my-8"
                alt="Drupal CMS"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
