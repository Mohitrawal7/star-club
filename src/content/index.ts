/* The only place pages read content from. Supabase queries will replace these functions. */
import { showSamples } from "@/lib/flags";
import { todayInNepal } from "@/lib/dates";
import { events, realCommittee, realNotices, realPhotos, realSettings } from "./data";
import { sampleCommittee, sampleNotices, samplePhotos, sampleResults, sampleSettings } from "./samples";
import type { ClubEvent } from "./types";

export { club } from "./data";

const withSamples = (event: ClubEvent): ClubEvent =>
  showSamples && !event.results && event.slug === "bhuwan-memorial-futsal-cup"
    ? { ...event, results: sampleResults }
    : event;

export const getEvents = () =>
  events.map(withSamples).sort((a, b) => b.startDate.localeCompare(a.startDate));

export const getEvent = (slug: string) => getEvents().find((e) => e.slug === slug);

export function splitEvents() {
  const today = todayInNepal();
  const all = getEvents();
  return {
    upcoming: all.filter((e) => e.endDate >= today).reverse(),
    past: all.filter((e) => e.endDate < today),
  };
}

export const getPhotos = (eventSlug?: string) => {
  const photos = realPhotos.length || !showSamples ? realPhotos : samplePhotos;
  return eventSlug ? photos.filter((p) => p.eventSlug === eventSlug) : photos;
};

export const getNotices = () =>
  [...(realNotices.length || !showSamples ? realNotices : sampleNotices)].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

export const getCommittee = () => ({
  names: realCommittee.length || !showSamples ? realCommittee : sampleCommittee,
  sample: !realCommittee.length && showSamples,
});

export const getSettings = () => (showSamples ? sampleSettings : realSettings);
