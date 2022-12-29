import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import userData from "../constants/data";
import Clock from "./Clock";
export default function ContainerBlock({ children, ...customMeta }) {
  const router = useRouter();

  const meta = {
    title: "Luke Percy - Creative writer, hobbyist developer and Agilist",
    description: `This is my site about me, my career and my projects`,
    type: "website",
    image: userData.avatarUrl,
    ...customMeta,
  };
  
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 150;
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }
  
  if (typeof window !== 'undefined') {
    window.addEventListener("scroll", reveal);
    // To check the scroll position on page load
    reveal();
  }
  
    // updates cached values after image dimensions have loaded
    const handleLoad = () => parallaxController.update();
  
  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={meta.description} />
        <meta name="color-scheme" content="dark light"/>
        <meta
          property="og:url"
          content={`${userData.domain}${router.asPath}`}
        />
        <link
          rel="canonical"
          href={`${userData.domain}${router.asPath}`}
        />
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
        {meta.date && (
          <meta property="article:published_time" content={meta.date} />
        )}
      </Head>
      <main className="dark:bg-gray-900 w-full">
        <Navbar/>
        <div>{children}</div>
        <Footer />
      </main>
    </div>
  );
}
