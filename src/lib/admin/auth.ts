import "server-only";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

/** Verifies the user with Supabase and confirms they are on the admin list. */
export async function getAdmin() {
  if (!supabaseConfigured) return null;
  const supabase = await serverClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("admins").select("display_name").eq("user_id", user.id).maybeSingle();
  return data ? { supabase, user, name: data.display_name ?? user.email ?? "Admin" } : null;
}

export async function requireAdmin() {
  return (await getAdmin()) ?? redirect("/admin/login");
}
