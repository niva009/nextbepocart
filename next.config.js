/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  ...(process.env.NODE_ENV === 'production' && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),

  images: {
    domains: ['72.167.55.172'],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true, // Set to true for a 308 permanent redirect
      },
    ];
  },
};
