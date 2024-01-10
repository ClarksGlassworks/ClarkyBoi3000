/** @type {import('next').NextConfig} */
const nextConfig = { 
    transpilePackages: ['three'],
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp.clarksglassworks.com',
        port: '',
      },
    ],
  },}

module.exports = nextConfig
