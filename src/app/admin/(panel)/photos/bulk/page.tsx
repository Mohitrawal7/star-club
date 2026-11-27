import Link from "next/link";
import BulkUpload from "@/components/admin/BulkUpload";
import { requireAdmin } from "@/lib/admin/auth";

export default async function Bulk() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("events").select("id, title").order("start_date", { ascending: false });
  return (
    <>
      <p><Link href="/admin/photos">Back</Link></p>
      <h1>Add several photos</h1>
      <BulkUpload events={(data ?? []).map((e) => ({ id: e.id, label: e.title }))} />
    </>
  );
}
