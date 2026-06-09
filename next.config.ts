import type { NextConfig } from 'next';

// Served at the root of the custom domain (bcbp.anhlp.com), so no basePath needed.
const nextConfig: NextConfig = {
  output: 'export', // static HTML export to ./out for GitHub Pages
};

export default nextConfig;
