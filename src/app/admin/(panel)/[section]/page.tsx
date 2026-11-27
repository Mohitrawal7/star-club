import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import LinkButton from "@/components/LinkButton";
import { requireAdmin } from "@/lib/admin/auth";
import { sections } from "@/lib/admin/sections";

export default async function List({ params }: PageProps<"/admin/[section]">) {
  const { supabase } = await requireAdmin();
  const { section: key } = await params;
  if (!Object.hasOwn(sections, key)) notFound();
  if (key === "settings") redirect("/admin/settings/1");
  const section = sections[key];
  const { data, error } = await supabase.from(section.table).select("*").order(section.order.column, { ascending: section.order.ascending });
  if (error) throw new Error(error.message);
  return (
    <>
      <h1>{section.label}</h1>
      <div className="actions admin-toolbar">
        <LinkButton href={`/admin/${key}/new`} type="primary">Add {section.singular}</LinkButton>
        {key === "photos" && <LinkButton href="/admin/photos/bulk">Add several photos</LinkButton>}
      </div>
      {data.length ? (
        <ul className="admin-list">
          {data.map((row) => (
            <li key={row.id}>
              <Link href={`/admin/${key}/${row.id}`}>{String(row[section.titleField])}</Link>
              <span className={row.status === "published" ? "status status-live" : "status"}>{row.status === "published" ? "Published" : "Draft"}</span>
            </li>
          ))}
        </ul>
      ) : <p>Nothing added yet.</p>}
    </>
  );
}
