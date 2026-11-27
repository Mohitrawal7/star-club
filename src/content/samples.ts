/* SAMPLE CONTENT: invented placeholders for previews only. None of this is real. */
import type { ClubEvent, Notice, Photo, SiteSettings } from "./types";

export const sampleResults: NonNullable<ClubEvent["results"]> = {
  sample: true,
  items: [
    { label: "Winner", value: "Sample Team A" },
    { label: "Runner-up", value: "Sample Team B" },
  ],
};

export const samplePhotos: Photo[] = [1, 2, 3, 4, 5, 6].map((n) => ({
  id: `sample-${n}`,
  src: `/samples/photo-${n}.jpeg`,
  alt: `Sample photo placeholder ${n}`,
  eventSlug: "bhuwan-memorial-futsal-cup",
  sample: true,
}));

export const sampleNotices: Notice[] = [
  {
    slug: "sample-notice",
    title: "Sample notice title",
    publishedAt: "2026-11-26",
    body: ["This is a sample notice that shows how an announcement will look. It is not a real announcement."],
    sample: true,
  },
];

export const sampleCommittee = ["Member name 1", "Member name 2", "Member name 3", "Member name 4"];

export const sampleSettings: SiteSettings = {
  email: "club@example.com",
  phone: "98XXXXXXXX",
  address: "Gobaraiya, Kanchanpur, Nepal",
  socials: [{ label: "Sample social link" }],
  isSample: true,
};
