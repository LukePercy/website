import React, { useEffect, useState } from "react";
import userData from "../constants/data";

export default function LatestCode({ repositories }) {
  const [repos, setRepos] = useState([]);

  useEffect(async () => {
    // let latestRepos = await getLatestRepos(userData);
    // console.log("latestRepos", latestRepos);
    setRepos(repositories);
  }, []);
  return (
    <section className="bg-[#F1F1F1] -mt-40 dark:bg-gray-900 pb-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center pt-20 mx-10 md:my-10 lg:my-10">
        <header className="flex flex-col md:flex-row justify-between -pt-10 -mx-10 md:-my-10 lg:-my-10">
          <h1 className="text-6xl lg:text-9xl max-w-lg font-bold text-gray-500 my-20 md:my-10 md:text-gray-500 dark:text-gray-300 text-left">
            Code.
          </h1>
        </header>
          <div className="transform hover:scale-110 hover:-rotate-3 transition duration-300">
          <a
            href={`https://github.com/${userData.githubUsername}`}
            target="_blank"
            className="mb-20 md:mb-0 px-8 py-4 rounded-md bg-white shadow-lg text-xl font-semibold flex flex-row space-x-4 items-center dark:text-gray-700 hover:bg-purple-500 rounded-md px-2 py-1 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-up-right-square"
              stroke="4"
              strokeWidth="4"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
              />
            </svg>
            <p>View on GitHub</p>
          </a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-10 lg:-mt-1 gap-y-20">
        {/* Single github Repo */}
        {repos &&
          repos.map((latestRepo, idx) => (
            <GithubRepoCard latestRepo={latestRepo} key="idx" />
          ))}
      </div>
    </section>
  );
}

const GithubRepoCard = ({ latestRepo }) => {
  let repoTitle;
  if (!latestRepo.private){
    repoTitle = <h1 className="font-semibold text-xl dark:text-gray-200 text-gray-700">
      {latestRepo.name}
    </h1>
  } else {
    repoTitle = <h1 className="font-semibold text-xl dark:text-gray-200 text-gray-700">
    {latestRepo.name}<span className="mx-1.5 bg-yellow-500 text-yellow-900 py-2 px-3 rounded-full text-xs font-bold">Private</span></h1>
  }
  return (
    <div className="github-repo">
        {repoTitle}
      <p className="text-base font-normal my-4 text-gray-600 dark:text-gray-300">
        {latestRepo.description}
      </p>
      <a
        href={latestRepo.clone_url}
        target="_blank"
        className="font-semibold group flex flex-row space-x-2 w-full items-center dark:text-white"
      >
        <p>View {latestRepo.name}</p>
        <div className="transform group-hover:translate-x-2 transition duration-300">
          &rarr;
        </div>
      </a>
    </div>
  );
};
