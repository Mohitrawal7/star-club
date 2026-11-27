// Both values are safe for browsers. Never add a secret or service-role key to this app.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (supabaseKey.startsWith("sb_secret_")) {
  throw new Error("A Supabase secret key was set as the publishable key. Remove it and rotate that key.");
}

export const mediaUrl = (path: string) =>
  `${supabaseUrl}/storage/v1/object/public/media/${path.split("/").map(encodeURIComponent).join("/")}`;
