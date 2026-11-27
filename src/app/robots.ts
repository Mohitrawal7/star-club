import type { MetadataRoute } from "next";
import { siteLaunched, siteUrl } from "@/lib/flags";

export default function robots(): MetadataRoute.Robots {
  return siteLaunched
    ? { rules: { userAgent: "*", allow: "/", disallow: "/admin" }, sitemap: `${siteUrl}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
