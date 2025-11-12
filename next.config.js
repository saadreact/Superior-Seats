/** @type {import('next').NextConfig} */
const nextConfig = {
 
  images: {
   domains: ['superiorseats.ali-khalid.com', '127.0.0.1', 'dev-api.superiorseatingllc.com','api.superiorseatingllc.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
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