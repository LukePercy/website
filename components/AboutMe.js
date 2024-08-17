import React from "react";
import userData from "../constants/data";
import { useRouter } from "next/router";

export default function AboutMe() {
  const router = useRouter();
  
  return (
    <section aria-label="about me" className="bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 dark:text-white">
        <h1 className="text-5xl md:text-9xl font-bold md:py-6 text-center xsm:py-2 md:text-left dark:text-white">
          About<span className="text-lg">me.</span>
        </h1>
      </div>
          <div className="grid grid-cols-8 dark:bg-gray-900 dark:text-white">
            <span className="flex md:col-start-3 md:text-2xl cursor-pointer hover:text-purple-500" onClick={() => router.back()}>&larr;<span className="pl-1">Back</span></span>
          </div>
      <div className="grid grid-cols-8 bg-[#F1F1F1] dark:bg-gray-900 dark:text-white">
        <div className="xsm:col-start-1 xsm:col-span-8 md:col-start-1 md:col-span-8 lg:col-start-3 lg:col-span-4  text-container pt-5">
          <p className="leading-relaxed xsm:text-base sm:text-xl md:text-2xl lg:text-4xl font-semibold mx-4"
          >
            {userData.about.title}<br/>
            {/* <Link href={userData.about.currentProjectUrl}>
            <a
              className="underline text-white hover:text-purple-500"
            >
              {userData.about.currentProject}
            </a>
            </Link> */}
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
                </a>{" "}at <span className="underline">lpercy@ljpercy.com</span>
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
                  <div className="my-4 dark:text-gray-300">&rarr;</div>
                  <p className="text-lg text-gray-600 font-mono relative overflow-hidden dark:text-gray-300">
                    <span className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></span>
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
                  <div className="my-4 dark:text-gray-300">&rarr;</div>
                  <p className="text-lg text-gray-600 font-mono relative overflow-hidden dark:text-gray-300">
                    <span className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></span>
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
                  <div className="my-4 dark:text-gray-300">&rarr;</div>
                  <p className="text-lg text-gray-600 font-mono relative overflow-hidden dark:text-gray-300">
                    <span className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></span>
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

            <h1 className="text-3xl rounded-md px-2 py-1 inline-block font-bold dark:text-gray-300">
              I love working with the following technologies
            </h1>
            <div className="flex flex-row flex-wrap mt-8">
              <img
                src='/javascript.webp'
                className="h-20 w-20 mx-4 my-4"
                alt="javascript"
              />
              <img
                src="/typescript.webp"
                className="h-20 w-20 mx-4 my-4"
                alt="Typescript"
              />
              <img
                src="/html.webp"
                className="h-20 w-20 mx-4 my-4 bg-white"
                alt="HTML"
              />
              <img
                src="/css.webp"
                className="h-20 w-20 mx-4 my-4 bg-white"
                alt="CSS"
              />
               <img
                src="/GitHub.webp"
                className="h-20 w-20 mx-4 my-4"
                alt="Git and GitHub"
              />
              <img
                src="/react.webp"
                className="h-20 w-20 mx-4 my-4"
                alt="ReactJS"
              />
              <img
                src="/mongodb.webp"
                className="h-20 w-20 mx-4 my-4"
                alt="MongoDB and NoSQL Databases"
              />
              <img
                src="/umbraco.webp"
                className="h-20 w-20 mx-4 my-4"
                alt="Umbraco CMS"
              />
              <img
                src="/ss-opensource.webp"
                className="h-10 w-15 mx-4 my-8"
                alt="Silverstripe CMS and framework"
              />
              <img
                src="/drupal-wordmark.webp"
                className="h-10 w-15 mx-4 my-8"
                alt="Drupal CMS"
              />
              <img
                src="/squiz-logo.webp"
                className="h-10 w-15 mx-4 my-8 bg-white"
                alt="Squiz Digital Experience Platform"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
