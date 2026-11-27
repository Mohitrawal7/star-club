import type { ClubEvent, Notice, Photo, SiteSettings } from "./types";

export const club = {
  name: "Star Club",
  nepaliName: "स्टार क्लब",
  location: "Gobaraiya, Kanchanpur, Nepal",
  // To use a real photo: put it in /public (for example hero.jpg) and change these two lines.
  heroImage: "/hero-court.svg",
  heroImageAlt: "", // describe the photo here; leave empty for the decorative illustration
  registration: "Not yet registered. Government registration is being prepared.",
};

/* Confirmed information only. Anything not yet supplied is left out. */
export const events: ClubEvent[] = [
  {
    slug: "bhuwan-memorial-futsal-cup",
    title: "Bhuwan Memorial Futsal Cup",
    category: "Sports",
    summary: "A 17-team futsal tournament organized by Star Club at Royal Futsal.",
    startDate: "2026-10-23",
    endDate: "2026-10-25",
    localDate: "Kartik 6–8, 2083",
    venue: "Royal Futsal",
    organizer: "Star Club",
    format: "A group stage, followed by a knockout round for the top 8 teams.",
    facts: [
      { label: "Teams", value: "17" },
      { label: "Groups", value: "4" },
    ],
    sponsors: [
      { name: "Perfect Ladies Shop" },
      { name: "Chiyadani" },
      { name: "Goldstar Shoes MNR" },
      { name: "Farwest Dental Home" },
    ],
    sponsorNote: "Other businesses also sponsored this event.",
  },
];

export const realNotices: Notice[] = [];
export const realPhotos: Photo[] = [];
export const realCommittee: string[] = [];

export const realSettings: SiteSettings = {
  address: club.location,
  socials: [],
  isSample: false,
};
