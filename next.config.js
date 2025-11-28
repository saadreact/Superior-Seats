/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'superiorseats.ali-khalid.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'superiorseats.ali-khalid.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dev-api.superiorseatingllc.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'dev-api.superiorseatingllc.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.superiorseatingllc.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'api.superiorseatingllc.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
    // Disable specific rules that are causing warnings
    dirs: ['src'],
  },
}

module.exports = nextConfig