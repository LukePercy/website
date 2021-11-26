import React from "react";
import ContainerBlock from "../components/ContainerBlock";
import Wip from "../components/Wip";
import { getAllPosts } from "../lib/data";

export default function wip({posts}) {
  return (
    <ContainerBlock 
    title="Check out what I am working on">
      <Wip posts={posts}/>
    </ContainerBlock>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts();
  return {
    props: {
      posts: allPosts.map(({ data, content, slug }) => ({
        ...data,
        date: data.date.toISOString(),
        content,
        slug,
      })),
    },
  };
}