import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getAdmin } from "@/lib/admin/auth";
import { supabaseConfigured } from "@/lib/supabase/env";

export default async function Login() {
  if (await getAdmin()) redirect("/admin");
  return (
    <div className="container admin-narrow">
      <h1>Admin sign in</h1>
      {supabaseConfigured ? <LoginForm /> : <p>Supabase is not connected yet. Follow the setup guide, then redeploy.</p>}
    </div>
  );
}
