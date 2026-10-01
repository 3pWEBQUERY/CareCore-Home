import type { NextConfig } from "next";

// Statische Website: `next build` schreibt alle Seiten nach `out/` (beliebiger Webserver oder CDN).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
