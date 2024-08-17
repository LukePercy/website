function gtag() {
  window.dataLayer && window.dataLayer.push(arguments);
}
export const pageview = (url) => {
  if (typeof window !== 'undefined') {
    gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    });
  }
}

export const event = ({ action, params }) => {
  if (typeof window !== 'undefined') {
    gtag('event', action, params);
  }
}