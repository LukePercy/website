/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    loader: 'imgix',
    path:"",
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
}