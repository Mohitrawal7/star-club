// Sample content must never appear on the live (production) site.
const isProductionDeploy = process.env.VERCEL_ENV === "production";

export const showSamples =
  !isProductionDeploy &&
  (process.env.SHOW_SAMPLES
    ? process.env.SHOW_SAMPLES === "true"
    : process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview");

export const siteLaunched = process.env.SITE_LAUNCHED === "true";

export const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
