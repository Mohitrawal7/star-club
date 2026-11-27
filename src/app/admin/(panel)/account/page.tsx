import PasswordForm from "@/components/admin/PasswordForm";
import { requireAdmin } from "@/lib/admin/auth";

export default async function Account() {
  await requireAdmin();
  return <><h1>Change your password</h1><PasswordForm /></>;
}
