/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    loader: 'custom',
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
}