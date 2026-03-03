/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      'cloud.appwrite.io',
      'fra.cloud.appwrite.io',
      'sfo.cloud.appwrite.io',
      'syd.cloud.appwrite.io',
      'youtube.com',
      'i.ytimg.com',
      'vimeo.com',
      'i.vimeocdn.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.appwrite.cloud',
      },
      {
        protocol: 'https',
        hostname: '**.cloud.appwrite.io',
      }
    ]
  },
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Plataforma de Capacitación',
  },
  // Configuración de Appwrite
  async rewrites() {
    return [
      {
        source: '/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/:path*`,
      },
    ];
  },
  // Configuración de headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
