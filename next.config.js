/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['superiorseats.ali-khalid.com', '127.0.0.1', 'dev-api.superiorseatingllc.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig 