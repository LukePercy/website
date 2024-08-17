/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    loader: 'custom',
    loaderFile: './loader.js',
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
}