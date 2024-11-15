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
    domains: ['bepocart-bkt-1.s3.amazonaws.com'],
  },

  async rewrites() {
    return [
      {
        source: '/',
        destination: '/en',
      },
    ];
  },
};
