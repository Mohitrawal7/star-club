import { Button } from "antd";
import Link from "next/link";
import { signOut } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { sections } from "@/lib/admin/sections";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <>
      <div className="admin-bar">
        <div className="container admin-bar-row">
          <Link href="/admin" className="wordmark">STAR CLUB admin</Link>
          <form action={signOut}><Button htmlType="submit">Sign out</Button></form>
        </div>
        <nav className="container admin-nav" aria-label="Admin">
          {Object.entries(sections).map(([key, s]) => <Link key={key} href={`/admin/${key}`}>{s.label}</Link>)}
          <Link href="/admin/account">Password</Link>
          <Link href="/">View website</Link>
        </nav>
      </div>
      <div className="container admin-body">
        <p className="muted">Signed in as {admin.name}</p>
        {children}
      </div>
    </>
  );
}
