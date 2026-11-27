/* The only place public pages read content from: Supabase when connected, local files otherwise. */
import { cache } from "react";
import { showSamples } from "@/lib/flags";
import { todayInNepal } from "@/lib/dates";
import { mediaUrl, supabaseConfigured } from "@/lib/supabase/env";
import { publicClient } from "@/lib/supabase/public";
import { club, events, realCommittee, realNotices, realPhotos, realSettings } from "./data";
import { sampleCommittee, sampleNotices, samplePhotos, sampleResults, sampleSettings } from "./samples";
import { toEvent, toSettings } from "./map";
import type { ClubEvent, Notice, Photo, SiteSettings } from "./types";

export { club } from "./data";

type Content = { events: ClubEvent[]; notices: Notice[]; photos: Photo[]; committee: string[]; settings: SiteSettings };

const localContent: Content = {
  events, notices: realNotices, photos: realPhotos, committee: realCommittee,
  settings: { ...realSettings, registration: club.registration },
};

async function databaseContent(): Promise<Content> {
  const db = publicClient();
  // "published" filters are repeated here; Row Level Security enforces them in the database.
  const results = await Promise.all([
    db.from("events").select("*, event_sponsors(sort_order, sponsors(name, logo_path, website_url, status))").eq("status", "published"),
    db.from("notices").select("*").eq("status", "published"),
    db.from("photos").select("*").eq("status", "published").order("sort_order").order("created_at"),
    db.from("committee_members").select("name").eq("status", "published").order("sort_order").order("name"),
    db.from("site_settings").select("*").eq("id", 1).single(),
  ]);
  // Failing loudly keeps the last good cached page, instead of caching an empty one.
  const failed = results.find((r) => r.error);
  if (failed) throw new Error(`Could not load website content: ${failed.error!.message}`);
  const [ev, no, ph, co, se] = results;
  const eventRows = ev.data ?? [];
  const slugs = new Map(eventRows.map((e) => [e.id, e.slug as string]));
  return {
    events: eventRows.map(toEvent),
    notices: (no.data ?? []).map((n) => ({
      slug: n.slug, title: n.title, publishedAt: n.published_at,
      body: String(n.body).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    })),
    photos: (ph.data ?? []).map((p) => ({
      id: p.id, src: mediaUrl(p.storage_path), alt: p.alt_text,
      eventSlug: p.event_id ? slugs.get(p.event_id) : undefined,
    })),
    committee: (co.data ?? []).map((c) => c.name),
    settings: toSettings(se.data!, club.location),
  };
}

const load = cache(async () => (supabaseConfigured ? databaseContent() : localContent));

const withSamples = (event: ClubEvent): ClubEvent =>
  showSamples && !event.results && event.slug === "bhuwan-memorial-futsal-cup"
    ? { ...event, results: sampleResults }
    : event;

export async function getEvents() {
  return (await load()).events.map(withSamples).sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export const getEvent = async (slug: string) => (await getEvents()).find((e) => e.slug === slug);

export async function splitEvents() {
  const today = todayInNepal();
  const all = await getEvents();
  return {
    upcoming: all.filter((e) => e.endDate >= today).reverse(),
    past: all.filter((e) => e.endDate < today),
  };
}

export async function getPhotos(eventSlug?: string) {
  const real = (await load()).photos;
  const photos = real.length || !showSamples ? real : samplePhotos;
  return eventSlug ? photos.filter((p) => p.eventSlug === eventSlug) : photos;
}

export async function getNotices() {
  const real = (await load()).notices;
  return [...(real.length || !showSamples ? real : sampleNotices)].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getCommittee() {
  const real = (await load()).committee;
  return { names: real.length || !showSamples ? real : sampleCommittee, sample: !real.length && showSamples };
}

export async function getSettings(): Promise<SiteSettings> {
  const real = (await load()).settings;
  const empty = !real.email && !real.phone && !real.socials.length;
  return showSamples && empty ? { ...real, ...sampleSettings, membershipFormUrl: real.membershipFormUrl, isSample: true } : real;
}
