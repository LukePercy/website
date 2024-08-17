'use client';

const myImageLoader = ({ src, width, height, quality }) => {
  // Use window.location.origin to get the current domain
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  
  // Ensure src starts with a '/'
  const validSrc = src.startsWith('/') ? src : `/${src}`;
  
  // Construct the URL
  const url = new URL(validSrc, origin);
  url.searchParams.set('w', width);
  url.searchParams.set('h', height);
  url.searchParams.set('q', quality || 75);
  
  return url.toString();
};

module.exports = myImageLoader;