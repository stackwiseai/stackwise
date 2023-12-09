/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://github.com/stackwiseai/stackwise',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
