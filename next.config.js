/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    loader: 'imgix',
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
}
