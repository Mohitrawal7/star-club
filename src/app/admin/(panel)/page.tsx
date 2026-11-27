import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { sections } from "@/lib/admin/sections";

export default async function Dashboard() {
  await requireAdmin();
  return (
    <>
      <h1>Manage the website</h1>
      <p>Publishing updates the website without any code change. Drafts stay hidden from visitors, but anyone with a photo’s direct file link can open the file.</p>
      <ul className="grid grid-2">
        {Object.entries(sections).map(([key, s]) => <li key={key} className="card"><h3><Link href={`/admin/${key}`}>{s.label}</Link></h3></li>)}
      </ul>
    </>
  );
}
