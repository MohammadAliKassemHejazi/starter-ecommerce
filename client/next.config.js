/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: ["./styles/scss", "./node_modules"],
    prependData: `@import "_base-theme.scss";`,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5300",
        pathname: "/api/compressed/**", // allows any path under /api/compressed/
      },
    ],
  },
};

module.exports = nextConfig;
