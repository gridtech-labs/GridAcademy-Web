/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.blob.core.windows.net' },
      // Railway backend — thumbnails and uploaded files
      { protocol: 'https', hostname: 'gridacademy-production.up.railway.app' },
    ],
  },
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
    return [
      // Proxy API calls during dev so we avoid CORS in browser
      {
        source: '/api/proxy/:path*',
        destination: `${apiBase}/:path*`,
      },
      // Proxy static uploads (thumbnails, banners, question images, etc.)
      // Files are stored on the API server's wwwroot — serve them via Next.js
      {
        source: '/uploads/:path*',
        destination: `${apiBase}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
