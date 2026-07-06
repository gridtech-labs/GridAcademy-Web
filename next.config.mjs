/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensures private PDFs are bundled into the standalone production output
  experimental: {
    outputFileTracingIncludes: {
      '/api/download/neet-week2': ['./src/app/NEET-2027-Week-2-Target-8-14-july.pdf'],
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.blob.core.windows.net' },
      // Railway backend — thumbnails and uploaded files
      { protocol: 'https', hostname: 'gridacademy-production.up.railway.app' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/exam/rrb-alp-2026-assistant-loco-pilot-recruitment-exam',
        destination: '/exam/rrb-alp-mock-test-series',
        permanent: true,
      },
      {
        source: '/exam/cuet-english-previous-year-question-paper',
        destination: '/exam/cuet-ug-previous-year-papers-pyp',
        permanent: true,
      },
    ];
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
