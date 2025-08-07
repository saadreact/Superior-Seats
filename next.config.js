/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['127.0.0.1', "https://superiorseats.ali-khalid.com"],
    unoptimized: true, // Allow all local images including those in subdirectories
  },
}

module.exports = nextConfig 