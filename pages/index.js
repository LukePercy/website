import ContainerBlock from "../components/ContainerBlock";
import FavouriteProjects from "../components/FavouriteProjects";
import LatestCode from "../components/LatestCode";
import Hero from "../components/Hero";
import getLatestRepos from "../lib/githubapi/getLatestRepos";
import userData from "../constants/data";

export default function Home({ repositories }) {
  return (
    <ContainerBlock
      title="Luke Percy - A hobbyist developer, creative writer and agilist"
      description="This is my site about me, my career and my projects"
    >
      <Hero />
      <FavouriteProjects />
      <LatestCode repositories={repositories} />
    </ContainerBlock>
  );
}

export const getServerSideProps = async () => {
  // console.log(process.env.GITHUB_AUTH_TOKEN);
  let token = process.env.GITHUB_AUTH_TOKEN;
  const repositories = await getLatestRepos(userData, token);
  // console.log("REPOSITORIES", repositories);

  return {
    props: {
      repositories,
    },
  };
};
