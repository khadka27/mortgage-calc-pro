import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    '192.168.1.128',
    '192.168.1.128:3000',
    '192.168.1.69',
    '192.168.1.69:3000',
    'localhost:3000',
    '127.0.0.1:3000',
  ],

  // Expose env vars to the client — NEXT_PUBLIC_* are exposed automatically,
  // but listing them here makes them visible in IDE intellisense and validates
  // they exist at build time.
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "MortgagePro Global",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  },
};

export default nextConfig;
