import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    serverActions: {
      allowedOrigins: ["videoroll.app", "*.videoroll.app", "localhost:3002", "localhost:3134", "console.videoroll.app"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  basePath: '/console',
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://console.videoroll.app' : '',
};

export default withNextIntl(nextConfig);
