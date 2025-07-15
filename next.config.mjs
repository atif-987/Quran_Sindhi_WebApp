/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/sitemap.xml',
          destination: '/sitemap', // assumes route is at app/sitemap/route.ts
        },
      ];
    },
  };
export default nextConfig;
