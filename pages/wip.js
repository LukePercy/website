import React from "react";
import ContainerBlock from "../components/ContainerBlock";
import Wip from "../components/Wip";
import { getAllPosts } from '../lib/blog/data';

export default function projects() {
  return (
    <ContainerBlock 
    title="Check out what I am working on">
      <Wip/>
    </ContainerBlock>
  );
}
