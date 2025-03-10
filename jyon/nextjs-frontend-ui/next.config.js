/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  pageExtensions: ["tsx"],
  images: {
    domains: ["ourvoice-assets-dev.s3.ap-southeast-2.amazonaws.com"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  async redirects() {
    return [
      {
        source: "/about",
        destination: `${process.env.NEXT_PUBLIC_MARKETING_PAGE_URL}`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
