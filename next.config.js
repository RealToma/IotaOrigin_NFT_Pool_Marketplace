/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  images: {
    domains: [
      'cdn.discordapp.com',
      'gateway.pinata.cloud',
      'snippool.infura-ipfs.io',
      'ipfs.io',
    ],
  },
  rewrites: () => [
    {
      source: '/api/coingecko_price/:path*',
      destination:
        'https://api.geckoterminal.com/api/v2/simple/networks/:path*',
    },
  ],
};

module.exports = nextConfig;
