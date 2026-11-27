"use client";

import { MenuOutlined, StarFilled } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LinkButton from "./LinkButton";

const links = [
  ["/", "Home"], ["/about", "About"], ["/events", "Events"],
  ["/gallery", "Gallery"], ["/notices", "Notices"], ["/contact", "Contact"],
] as const;

export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const items = links.map(([href, label]) => {
    const active = href === "/" ? path === "/" : path.startsWith(href);
    return (
      <Link key={href} href={href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
        {label}
      </Link>
    );
  });

  return (
    <header className="header">
      <div className="container header-row">
        <Link href="/" className="wordmark"><StarFilled aria-hidden="true" className="wordmark-star" /> STAR CLUB</Link>
        <nav className="nav-desktop" aria-label="Main">{items}</nav>
        <div className="header-actions">
          <LinkButton href="/join" type="primary">Join Us</LinkButton>
          <Button className="nav-toggle" icon={<MenuOutlined />} aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} />
        </div>
      </div>
      <Drawer title="Menu" open={open} onClose={() => setOpen(false)} size={280}>
        <nav className="nav-mobile" aria-label="Main">{items}</nav>
      </Drawer>
    </header>
  );
}
