/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    // Ensure the path to Bootstrap's SCSS folder is included
    includePaths: [
      "./styles/scss",
      "./node_modules/bootstrap/scss",
      "./node_modules/react-bootstrap/scss", // <-- ADD THIS LINE
      "./node_modules",
    ],
    // This prepends content to every SCSS file compiled by Next.js
    prependData: `@import "_base-theme.scss";`,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5300",
        pathname: "/compressed/**",
      },
    ],
  },
};

module.exports = nextConfig;
