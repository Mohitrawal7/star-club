// Sample content must never appear on the live (production) site.
const isProductionDeploy = process.env.VERCEL_ENV === "production";

export const showSamples =
  !isProductionDeploy &&
  (process.env.SHOW_SAMPLES
    ? process.env.SHOW_SAMPLES === "true"
    : process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview");

export const siteLaunched = process.env.SITE_LAUNCHED === "true";

/** Accepts the address with or without https://, and ignores an empty or broken value. */
function cleanSiteUrl(...candidates: (string | undefined)[]) {
  for (const candidate of candidates) {
    const text = candidate?.trim();
    if (!text) continue;
    try {
      return new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`).origin;
    } catch {
      // Try the next value.
    }
  }
  return "http://localhost:3000";
}

export const siteUrl = cleanSiteUrl(process.env.SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL);