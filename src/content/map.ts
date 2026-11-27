/* Turns database rows into the shapes pages use. Shared with the admin preview. */
import { mediaUrl } from "@/lib/supabase/env";
import type { ClubEvent, SiteSettings } from "./types";

/** "Label: value" per line. */
export const parseLines = (text?: string | null) =>
  (text ?? "").split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const i = line.indexOf(":");
    return i > 0 ? { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() } : { label: "Note", value: line };
  });

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export function toEvent(input: object): ClubEvent {
  const e = input as Row;
  const results = parseLines(e.results);
  return {
    slug: e.slug, title: e.title, category: e.category, summary: e.summary,
    description: e.description ?? undefined,
    startDate: e.start_date, endDate: e.end_date, localDate: e.local_date ?? undefined,
    venue: e.venue, organizer: e.organizer, format: e.format ?? undefined,
    facts: parseLines(e.facts),
    results: results.length ? { items: results } : undefined,
    sponsors: ((e.event_sponsors ?? []) as Row[])
      .filter((l) => l.sponsors && l.sponsors.status === "published")
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((l) => ({
        name: l.sponsors.name,
        logoSrc: l.sponsors.logo_path ? mediaUrl(l.sponsors.logo_path) : undefined,
        websiteUrl: l.sponsors.website_url ?? undefined,
      })),
    sponsorNote: e.sponsor_note ?? undefined,
    registrationUrl: e.registration_url ?? undefined,
    registrationDeadline: e.registration_deadline ?? undefined,
  };
}

export function toSettings(s: Row, address: string): SiteSettings {
  const socials = ([["Facebook", s.facebook_url], ["Instagram", s.instagram_url], ["TikTok", s.tiktok_url], ["YouTube", s.youtube_url]] as const)
    .filter(([, url]) => url).map(([label, url]) => ({ label, url: url as string }));
  return {
    address, socials, isSample: false, registration: s.registration_wording,
    email: s.email ?? undefined, phone: s.phone ?? undefined,
    membershipFormUrl: s.membership_form_url ?? undefined,
  };
}
