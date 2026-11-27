import type { MetadataRoute } from "next";
import { getEvents, getNotices } from "@/content";
import { siteUrl } from "@/lib/flags";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = ["", "/about", "/events", "/gallery", "/notices", "/join", "/contact", "/privacy",
    ...(await getEvents()).map((e) => `/events/${e.slug}`),
    ...(await getNotices()).filter((n) => !n.sample).map((n) => `/notices/${n.slug}`)];
  return paths.map((p) => ({ url: `${siteUrl}${p}` }));
}
