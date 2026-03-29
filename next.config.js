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
  async rewrites() {
    return [
      {
        // /novel/read serves the protected novel HTML via the API handler.
        // The browser URL stays /novel/read (not /api/novel/read).
        source: '/novel/read',
        destination: '/api/novel/read',
      },
    ];
  },
};