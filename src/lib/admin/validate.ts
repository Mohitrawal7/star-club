import type { Field, Section } from "./sections";

export const slugify = (text: string) =>
  text.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100).replace(/-+$/, "");

export const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

const isDate = (v: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().startsWith(v);

function check(field: Field, v: string): string | null {
  if (field.max && v.length > field.max) return `use ${field.max} characters or fewer`;
  switch (field.type) {
    case "date": return isDate(v) ? null : "enter a valid date";
    case "url": {
      try { return new URL(v).protocol === "https:" && v.startsWith("https://") ? null : "the link must start with https://"; }
      catch { return "enter a full link starting with https://"; }
    }
    case "email": return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? null : "enter a valid email address";
    case "phone": return /^[0-9+() -]{6,25}$/.test(v) ? null : "use digits, spaces, +, - or brackets";
    case "slug": return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v) ? null : "use small letters, numbers and hyphens";
    case "number": return /^-?\d{1,6}$/.test(v) ? null : "enter a whole number";
    case "select": return field.options?.includes(v) ? null : "choose one of the options";
    case "event": return isUuid(v) ? null : "choose an event from the list";
    default: return null;
  }
}

/** Server-side validation. Only fields listed for the section are accepted. Images and sponsors are handled separately. */
export function validate(section: Section, form: FormData) {
  const values: Record<string, string | number | null> = {};
  for (const field of section.fields) {
    if (field.type === "image" || field.type === "sponsors") continue;
    let v = String(form.get(field.name) ?? "").replace(/\r\n/g, "\n").trim();
    if (field.type === "slug" && !v) v = slugify(String(form.get("title") ?? "")) || `item-${Date.now()}`;
    if (!v) {
      if (field.required) return { error: `${field.label}: this is required.` };
      values[field.name] = field.type === "number" ? 0 : null;
      continue;
    }
    const problem = check(field, v);
    if (problem) return { error: `${field.label}: ${problem}.` };
    values[field.name] = field.type === "number" ? Number(v) : v;
  }
  if (section.hasStatus) {
    const status = String(form.get("status") ?? "draft");
    if (status !== "draft" && status !== "published") return { error: "Choose draft or published." };
    values.status = status;
  }
  if (values.start_date && values.end_date && values.end_date < values.start_date) {
    return { error: "End date: it cannot be before the start date." };
  }
  return { values };
}
