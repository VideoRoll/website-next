import nextra from "nextra";

// Set up Nextra with its configuration
const withNextra = nextra({
  // ... Add Nextra-specific options here
  contentDirBasePath: "/docs",
});

// Export the final Next.js config with Nextra included
export default withNextra({
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    serverActions: {
      allowedOrigins: ["videoroll.app", "*.videoroll.app", "localhost:3001"],
    },
  },
  // ... Add regular Next.js options here
});
