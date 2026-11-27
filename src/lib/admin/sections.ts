export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "url" | "email" | "phone" | "number" | "select" | "slug" | "image" | "event" | "sponsors";
  required?: boolean;
  max?: number;
  options?: string[];
  help?: string;
};

export type Section = {
  table: string;
  label: string;
  singular: string;
  titleField: string;
  order: { column: string; ascending: boolean };
  hasStatus: boolean;
  preview?: boolean;
  fields: Field[];
};

const sortOrder: Field = { name: "sort_order", label: "Order (smaller numbers show first)", type: "number" };
const slug: Field = { name: "slug", label: "Web address ending", type: "slug", max: 100, help: "Leave empty to create it from the title. Changing it later breaks old links." };

export const sections: Record<string, Section> = {
  events: {
    table: "events", label: "Events", singular: "event", titleField: "title",
    order: { column: "start_date", ascending: false }, hasStatus: true, preview: true,
    fields: [
      { name: "title", label: "Event name", type: "text", required: true, max: 160 }, slug,
      { name: "category", label: "Category", type: "select", options: ["Sports", "Creative"], required: true },
      { name: "summary", label: "Short summary", type: "textarea", required: true, max: 400 },
      { name: "description", label: "Longer description or report", type: "textarea", max: 5000 },
      { name: "start_date", label: "Start date", type: "date", required: true },
      { name: "end_date", label: "End date", type: "date", required: true },
      { name: "local_date", label: "Nepali date", type: "text", max: 60, help: "For example: Kartik 6–8, 2083" },
      { name: "venue", label: "Venue", type: "text", required: true, max: 160 },
      { name: "organizer", label: "Organizer", type: "text", required: true, max: 160 },
      { name: "format", label: "Format", type: "textarea", max: 1000 },
      { name: "facts", label: "Key numbers", type: "textarea", max: 1000, help: "One per line, as Label: value. For example: Teams: 17" },
      { name: "results", label: "Results and awards", type: "textarea", max: 1000, help: "One per line, as Label: value. For example: Winner: team name. Leave empty until confirmed." },
      { name: "sponsors", label: "Sponsors", type: "sponsors", help: "Only published sponsors appear on the website." },
      { name: "sponsor_note", label: "Note under sponsors", type: "text", max: 400 },
      { name: "registration_url", label: "Registration form link", type: "url", max: 500 },
      { name: "registration_deadline", label: "Registration deadline", type: "date" },
    ],
  },
  notices: {
    table: "notices", label: "Notices", singular: "notice", titleField: "title",
    order: { column: "published_at", ascending: false }, hasStatus: true, preview: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 160 }, slug,
      { name: "published_at", label: "Notice date", type: "date", required: true },
      { name: "body", label: "Notice text", type: "textarea", required: true, max: 10000, help: "Leave an empty line between paragraphs." },
    ],
  },
  photos: {
    table: "photos", label: "Photos", singular: "photo", titleField: "alt_text",
    order: { column: "sort_order", ascending: true }, hasStatus: true,
    fields: [
      { name: "storage_path", label: "Photo", type: "image", required: true },
      { name: "alt_text", label: "Description of the photo", type: "text", required: true, max: 200, help: "Read aloud to people who cannot see the photo." },
      { name: "event_id", label: "Event", type: "event" }, sortOrder,
    ],
  },
  committee: {
    table: "committee_members", label: "Working committee", singular: "name", titleField: "name",
    order: { column: "sort_order", ascending: true }, hasStatus: true,
    fields: [{ name: "name", label: "Full name", type: "text", required: true, max: 120, help: "Publish only with this person’s agreement." }, sortOrder],
  },
  sponsors: {
    table: "sponsors", label: "Sponsors", singular: "sponsor", titleField: "name",
    order: { column: "name", ascending: true }, hasStatus: true,
    fields: [
      { name: "name", label: "Business name", type: "text", required: true, max: 120 },
      { name: "logo_path", label: "Logo", type: "image" },
      { name: "website_url", label: "Website link", type: "url", max: 500 },
    ],
  },
  settings: {
    table: "site_settings", label: "Contacts and settings", singular: "settings", titleField: "registration_wording",
    order: { column: "id", ascending: true }, hasStatus: false,
    fields: [
      { name: "registration_wording", label: "Registration wording", type: "textarea", required: true, max: 300, help: "Do not say the club is registered until approval is confirmed." },
      { name: "email", label: "Public email", type: "email", max: 200 },
      { name: "phone", label: "Public phone", type: "phone", max: 25 },
      { name: "facebook_url", label: "Facebook link", type: "url", max: 500 },
      { name: "instagram_url", label: "Instagram link", type: "url", max: 500 },
      { name: "tiktok_url", label: "TikTok link", type: "url", max: 500 },
      { name: "youtube_url", label: "YouTube link", type: "url", max: 500 },
      { name: "membership_form_url", label: "Membership Google Form link", type: "url", max: 500 },
    ],
  },
};
