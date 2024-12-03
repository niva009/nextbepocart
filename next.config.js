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
    domains: ['bepocart.in']
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
