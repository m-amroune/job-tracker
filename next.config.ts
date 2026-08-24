import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@tanstack/react-table",
    "@tanstack/table-core",
    "@tanstack/react-store",
    "@tanstack/store",
  ],
};

export default nextConfig;