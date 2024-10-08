import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import userData from "../constants/data";

export default function ContainerBlock({ children, ...customMeta }) {
  const router = useRouter();

  const meta = {
    title: "Luke Percy - Creative Writer, Developer, Agile Coach | Portfolio & Projects",
    description: "Explore the portfolio of Luke Percy, a creative writer, developer, and Agile coach. Discover my projects, writing, and insights in technology and agile methodologies.",
    type: "website",
    image: userData.avatarUrl,
    ...customMeta,
  };

  React.useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        } else {
          reveals[i].classList.remove("active");
        }
      }
    };
    window.addEventListener("scroll", reveal);
    reveal(); // Initial check

    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={meta.description} />
        <meta name="keywords" content="Luke Percy, creative writer, hobbyist developer, agile coach, portfolio, web development, agile methodologies, writing, technology projects"/>
        <meta name="color-scheme" content="dark light"/>
        <meta property="og:url" content={`${userData.domain}${router.asPath}`} />
        <link rel="canonical" href={`${userData.domain}${router.asPath}`} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="Luke Percy" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@agilecreep" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        {meta.date && <meta property="article:published_time" content={meta.date} />}
      </Head>
      <main className="dark:bg-gray-900 w-full">
        <Navbar />
        <div>{children}</div>
        <Footer />
      </main>
    </>
  );
}
