/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  // experimental: {
  //   appDir: true,
  // },

  ...(process.env.NODE_ENV === 'production' && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),

  images: {
    domains: ['bepocart-bkt-1.s3.amazonaws.com'], // Add your external hostname here
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true, // Set to true for a 308 permanent redirect; false for a 307 temporary redirect
      },
    ];
  },
};
