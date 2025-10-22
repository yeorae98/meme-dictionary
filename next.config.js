/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'i.imgur.com', 'upload.wikimedia.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig

