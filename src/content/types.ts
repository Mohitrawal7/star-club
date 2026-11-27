// Shapes mirror the planned Supabase tables, so pages will not change when the database arrives.
export type Photo = { id: string; src: string; alt: string; eventSlug?: string; sample?: boolean };

export type Sponsor = { name: string; logoSrc?: string; websiteUrl?: string; sample?: boolean };

export type ClubEvent = {
  slug: string;
  title: string;
  category: "Sports" | "Creative";
  summary: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  localDate?: string; // Nepali (BS) date as announced
  venue: string;
  organizer: string;
  format?: string;
  description?: string;
  facts: { label: string; value: string }[];
  results?: { items: { label: string; value: string }[]; sample?: boolean };
  sponsors: Sponsor[];
  sponsorNote?: string;
  registrationUrl?: string;
  registrationDeadline?: string;
};

export type Notice = { slug: string; title: string; body: string[]; publishedAt: string; sample?: boolean };

export type SiteSettings = {
  email?: string;
  phone?: string;
  address: string;
  socials: { label: string; url?: string }[];
  membershipFormUrl?: string;
  registration?: string;
  isSample: boolean;
};
