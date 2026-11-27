import Link from "next/link";
import { notFound } from "next/navigation";
import RecordForm from "@/components/admin/RecordForm";
import { requireAdmin } from "@/lib/admin/auth";
import { sections } from "@/lib/admin/sections";
import { isUuid } from "@/lib/admin/validate";
import { todayInNepal } from "@/lib/dates";
import { mediaUrl } from "@/lib/supabase/env";

export default async function Edit({ params, searchParams }: PageProps<"/admin/[section]/[id]">) {
  const { supabase } = await requireAdmin();
  const { section: key, id } = await params;
  if (!Object.hasOwn(sections, key)) notFound();
  const section = sections[key];
  const isNew = id === "new" && key !== "settings";
  if (!isNew && !(key === "settings" ? id === "1" : isUuid(id))) notFound();

  let record: Record<string, unknown> = key === "notices" ? { published_at: todayInNepal() } : {};
  if (!isNew) {
    const { data } = await supabase.from(section.table).select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    record = data;
  }
  const [events, sponsors, links] = await Promise.all([
    supabase.from("events").select("id, title").order("start_date", { ascending: false }),
    supabase.from("sponsors").select("id, name, status").order("name"),
    key === "events" && !isNew ? supabase.from("event_sponsors").select("sponsor_id").eq("event_id", id) : null,
  ]);
  const image = section.fields.find((f) => f.type === "image");
  const path = image ? (record[image.name] as string | undefined) : undefined;

  return (
    <>
      <p><Link href={key === "settings" ? "/admin" : `/admin/${key}`}>Back</Link></p>
      <h1>{key === "settings" ? section.label : `${isNew ? "Add" : "Edit"} ${section.singular}`}</h1>
      <RecordForm
        key={id}
        sectionKey={key} section={section} id={isNew ? null : id} record={record}
        events={(events.data ?? []).map((e) => ({ id: e.id, label: e.title }))}
        sponsors={(sponsors.data ?? []).map((s) => ({ id: s.id, label: s.status === "draft" ? `${s.name} (draft)` : s.name }))}
        chosenSponsors={(links?.data ?? []).map((l) => l.sponsor_id)}
        imageUrl={path ? mediaUrl(path) : undefined}
        saved={(await searchParams).saved === "1"}
      />
    </>
  );
}
