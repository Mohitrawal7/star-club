import type { NextConfig } from "next";

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;
const localSupabase = supabase?.hostname === "127.0.0.1"; // local testing only

const nextConfig: NextConfig = {
  // Images are shrunk in the browser first; this stays under Vercel's request limit.
  experimental: { serverActions: { bodySizeLimit: "4.4mb" } },
  images: {
    remotePatterns: supabase ? [new URL(`${supabase.origin}/storage/v1/object/public/media/**`)] : [],
    dangerouslyAllowLocalIP: localSupabase,
  },
  async headers() {
    return [
      { source: "/:path*", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ] },
    ];
  },
};

export default nextConfig;
