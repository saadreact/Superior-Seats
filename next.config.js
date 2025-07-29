/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: true, // Allow all local images including those in subdirectories
  },
}

module.exports = nextConfig 