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
  // Keep ESLint enabled during builds (best practice for code quality)
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },
  // Keep TypeScript type checking enabled (best practice for code quality)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Note: SWC minification is enabled by default in Next.js 15+ (no config needed)
  
  // OPTIMIZATION: Compress output (best practice for production)
  compress: true,
  
  // OPTIMIZATION: Disable source maps in production (best practice for security and performance)
  // Source maps can expose source code and slow down builds
  productionBrowserSourceMaps: false,
  
  // OPTIMIZATION: Tree-shake unused exports from large packages (best practice)
  // This reduces bundle size and improves build performance
  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      '@mui/lab',
      'three',
      'framer-motion',
    ],
  },
  
  // OPTIMIZATION: Webpack optimizations for deterministic builds and better caching
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Use deterministic module IDs for better caching between builds
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
      };
    }
    
    return config;
  },
}

module.exports = nextConfig