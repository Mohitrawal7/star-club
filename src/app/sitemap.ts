import type { MetadataRoute } from "next";
import { getEvents, getNotices } from "@/content";
import { siteUrl } from "@/lib/flags";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/events", "/gallery", "/notices", "/join", "/contact", "/privacy",
    ...getEvents().map((e) => `/events/${e.slug}`),
    ...getNotices().filter((n) => !n.sample).map((n) => `/notices/${n.slug}`)];
  return paths.map((p) => ({ url: `${siteUrl}${p}` }));
}
