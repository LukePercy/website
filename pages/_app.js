import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import * as ga from '../lib/ga/index'
import Chatty from '../components/Chatty'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <ParallaxProvider>
      <Component {...pageProps}/>
      </ParallaxProvider>
      <Chatty/>
    </ThemeProvider>
  );
}

export default MyApp;
