function gtag(){ window.dataLayer && window.dataLayer.push(arguments); }

// log the pageview with their URL
export const pageview = (url) => {
  if (typeof window !== 'undefined') {
    gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    });
  }
  }
  
// log specific events happening.
export const event = ({ action, params }) => {
    window.gtag('event', action, params)
  }