import Link from "next/link";
import { notFound } from "next/navigation";
import { eventDates, SponsorGrid } from "@/components/blocks";
import { toEvent } from "@/content/map";
import { requireAdmin } from "@/lib/admin/auth";
import { isUuid } from "@/lib/admin/validate";
import { formatDate } from "@/lib/dates";

export default async function Preview({ params }: PageProps<"/admin/preview/[section]/[id]">) {
  const { supabase } = await requireAdmin();
  const { section, id } = await params;
  if (!isUuid(id) || (section !== "events" && section !== "notices")) notFound();
  const { data } = await supabase.from(section)
    .select(section === "events" ? "*, event_sponsors(sort_order, sponsors(name, logo_path, website_url, status))" : "*")
    .eq("id", id).maybeSingle();
  if (!data) notFound();
  const row = data as unknown as Record<string, string>;
  const event = section === "events" ? toEvent(data as object) : null;
  return (
    <article className="prose">
      <p><Link href={`/admin/${section}/${id}`}>Back to editing</Link></p>
      <p><strong>Preview only. Status: {row.status}.</strong></p>
      <h1>{row.title}</h1>
      {event ? (
        <>
          <p>{event.summary}</p>
          <p>{eventDates(event)}<br />{event.venue}<br />Organizer: {event.organizer}</p>
          {event.description && <p className="preline">{event.description}</p>}
          {event.format && <p>{event.format}</p>}
          <ul>{[...event.facts, ...(event.results?.items ?? [])].map((f, i) => <li key={i}>{f.label}: {f.value}</li>)}</ul>
          <SponsorGrid sponsors={event.sponsors} />
          {event.sponsorNote && <p>{event.sponsorNote}</p>}
        </>
      ) : (
        <>
          <p>{formatDate(row.published_at)}</p>
          <p className="preline">{row.body}</p>
        </>
      )}
    </article>
  );
}
