// basePath is injected by the GitHub Pages workflow (PAGES_BASE_PATH).
// Empty locally and for user/custom-domain sites; "/<repo>" for project pages.
const basePath = process.env.PAGES_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",                 // emit a static ./out folder
  basePath: basePath || undefined,
  trailingSlash: true,              // folder/index.html — plays nice with Pages
  images: { unoptimized: true },
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
