/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: ['./styles/scss', './node_modules'],
    prependData: `@import "_base-theme.scss";`
  }
}

module.exports = nextConfig