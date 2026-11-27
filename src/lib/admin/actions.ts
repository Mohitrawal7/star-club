"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { getAdmin } from "./auth";
import { processImage } from "./image";
import { sections } from "./sections";
import { isUuid, validate } from "./validate";

export type Result = { error?: string; ok?: string };
const signedOut: Result = { error: "Your session has ended. Sign in again in a new tab, then retry." };

export async function signIn(_: Result, form: FormData): Promise<Result> {
  if (!supabaseConfigured) return { error: "Supabase is not connected yet." };
  const supabase = await serverClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("password") ?? ""),
  });
  if (error) return { error: error.status === 429 ? "Too many attempts. Wait a few minutes, then try again." : "Sign-in failed. Check your email and password." };
  if (!(await getAdmin())) {
    await supabase.auth.signOut();
    return { error: "This account is not allowed to manage the website." };
  }
  redirect("/admin");
}

export async function signOut() {
  await (await serverClient()).auth.signOut({ scope: "local" });
  redirect("/admin/login");
}

export async function changePassword(_: Result, form: FormData): Promise<Result> {
  const admin = await getAdmin();
  if (!admin) return signedOut;
  const password = String(form.get("password") ?? "");
  if (password.length < 12) return { error: "Use at least 12 characters." };
  if (password !== String(form.get("confirm") ?? "")) return { error: "The two passwords do not match." };
  const { error } = await admin.supabase.auth.updateUser({ password });
  return error ? { error: "The password could not be changed. Sign in again and retry." } : { ok: "Password changed." };
}

const friendly = (code?: string) =>
  code === "23505" ? "That name or web address is already used. Choose another."
  : code === "23514" ? "One of the values is not allowed. Check the fields and try again."
  : "The change could not be saved. Try again.";

/** Publishing refreshes every public page, with no code change or new deployment. */
const refreshSite = () => revalidatePath("/", "layout");

export async function saveRecord(key: string, id: string | null, form: FormData): Promise<Result & { id?: string }> {
  const admin = await getAdmin();
  if (!admin) return signedOut;
  const section = Object.hasOwn(sections, key) ? sections[key] : undefined;
  const isSettings = key === "settings";
  if (!section || (isSettings ? id !== "1" : id !== null && !isUuid(id))) return { error: "Unknown item." };

  const checked = validate(section, form);
  if (!checked.values) return { error: checked.error };
  const values: Record<string, unknown> = { ...checked.values };

  const { supabase } = admin;
  const uploaded: string[] = [];
  const replaced: string[] = [];
  const imageField = section.fields.find((f) => f.type === "image");
  if (imageField) {
    let current: string | null = null;
    if (id) {
      const { data } = await supabase.from(section.table).select("*").eq("id", id).maybeSingle();
      current = (data?.[imageField.name] as string | null) ?? null;
    }
    const file = form.get(imageField.name);
    if (file instanceof File && file.size > 0) {
      let body: Buffer;
      try { body = await processImage(file); } catch (e) { return { error: (e as Error).message }; }
      const path = `${key}/${crypto.randomUUID()}.webp`;
      const { error } = await supabase.storage.from("media").upload(path, body, { contentType: "image/webp", cacheControl: "31536000" });
      if (error) return { error: "The image could not be uploaded. Try again." };
      uploaded.push(path);
      if (current) replaced.push(current);
      values[imageField.name] = path;
    } else if (imageField.required && !current) {
      return { error: `${imageField.label}: choose an image.` };
    }
  }

  const query = id
    ? supabase.from(section.table).update(values).eq("id", id)
    : supabase.from(section.table).insert(values);
  const { data, error } = await query.select("id").single();
  if (error || !data) {
    if (uploaded.length) await supabase.storage.from("media").remove(uploaded);
    return { error: friendly(error?.code) };
  }
  if (replaced.length) await supabase.storage.from("media").remove(replaced);

  if (key === "events") {
    const chosen = [...new Set(form.getAll("sponsors").map(String).filter(isUuid))];
    let failed = false;
    if (chosen.length) {
      const rows = chosen.map((sponsor_id, i) => ({ event_id: data.id, sponsor_id, sort_order: i + 1 }));
      failed = Boolean((await supabase.from("event_sponsors").upsert(rows, { onConflict: "event_id,sponsor_id" })).error);
    }
    if (!failed) {
      let removal = supabase.from("event_sponsors").delete().eq("event_id", data.id);
      if (chosen.length) removal = removal.not("sponsor_id", "in", `(${chosen.join(",")})`);
      failed = Boolean((await removal).error);
    }
    if (failed) {
      refreshSite();
      return { id: String(data.id), error: "The event was saved, but its sponsor list was not. Open it and save again." };
    }
  }

  refreshSite();
  return { id: String(data.id), ok: values.status === "draft" ? "Saved as a draft." : values.status ? "Published." : "Saved." };
}

export async function deleteRecord(key: string, id: string): Promise<Result> {
  const admin = await getAdmin();
  if (!admin) return signedOut;
  if (key === "settings" || !Object.hasOwn(sections, key) || !isUuid(id)) return { error: "Unknown item." };
  const section = sections[key];
  const { data, error } = await admin.supabase.from(section.table).delete().eq("id", id).select("*").single();
  if (error || !data) return { error: "It could not be deleted. Try again." };
  const imageField = section.fields.find((f) => f.type === "image");
  const path = imageField ? (data[imageField.name] as string | null) : null;
  if (path) await admin.supabase.storage.from("media").remove([path]);
  refreshSite();
  return { ok: "Deleted." };
}
