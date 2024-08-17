
'use client'

const URL = 'https://ljpercy.com';

const myImageLoader = ({ src, width, quality }) => {
  return `${URL}${src}?w=${width}&q=${quality || 75}`;
};

module.exports = myImageLoader;