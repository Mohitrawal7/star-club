import Image from "next/image";
import Link from "next/link";
import { club } from "@/content/data";
import { showSamples } from "@/lib/flags";
import { formatDate } from "@/lib/dates";
import type { ClubEvent, Notice, Photo, SiteSettings, Sponsor } from "@/content/types";

export const SampleBadge = () => <span className="sample-badge">Sample</span>;

export function PageIntro({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="page-intro">
      <Image src={club.heroImage} alt="" fill sizes="100vw" preload unoptimized={club.heroImage.endsWith(".svg")} className="cover" />
      <div className="container">
        <h1>{title}</h1>
        {children && <p>{children}</p>}
      </div>
    </div>
  );
}

export function Section({ title, tone, action, children }: {
  title: string; tone?: "soft"; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section className={tone === "soft" ? "section section-soft" : "section"}>
      <div className="container">
        <div className="section-head"><h2>{title}</h2>{action}</div>
        {children}
      </div>
    </section>
  );
}

export const eventDates = (e: ClubEvent) => {
  const ad = e.startDate === e.endDate ? formatDate(e.startDate) : `${formatDate(e.startDate)} to ${formatDate(e.endDate)}`;
  return e.localDate ? `${e.localDate} (${ad})` : ad;
};

export function EventCard({ event }: { event: ClubEvent }) {
  return (
    <article className="card event-card">
      <p className="tag">{event.category}</p>
      <h3><Link href={`/events/${event.slug}`}>{event.title}</Link></h3>
      <p>{event.summary}</p>
      <p className="muted">{eventDates(event)}<br />{event.venue}</p>
    </article>
  );
}

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  return (
    <ul className="grid grid-photos">
      {photos.map((p) => (
        <li key={p.id}>
          <Image src={p.src} alt={p.alt} width={800} height={600} unoptimized={p.src.endsWith(".svg")} sizes="(max-width: 640px) 100vw, 360px" />
        </li>
      ))}
    </ul>
  );
}

export function SponsorGrid({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <ul className="grid grid-sponsors">
      {sponsors.map((s) => (
        <li key={s.name} className="card sponsor">
          {s.logoSrc ? (
            <Image src={s.logoSrc} alt="" width={160} height={64} className="logo-image" />
          ) : showSamples ? (
            <span className="logo-slot" aria-hidden="true">Sample logo</span>
          ) : null}
          <span>{s.name}</span>
        </li>
      ))}
    </ul>
  );
}

export function NoticeList({ notices }: { notices: Notice[] }) {
  return (
    <ul className="grid">
      {notices.map((n) => (
        <li key={n.slug} className="card">
          <p className="muted">{formatDate(n.publishedAt)} {n.sample && <SampleBadge />}</p>
          <h3><Link href={`/notices/${n.slug}`}>{n.title}</Link></h3>
        </li>
      ))}
    </ul>
  );
}

export function ContactDetails({ settings }: { settings: SiteSettings }) {
  return (
    <dl className="facts">
      <div><dt>Address</dt><dd>{settings.address}</dd></div>
      {settings.email && <div><dt>Email {settings.isSample && <SampleBadge />}</dt><dd>{settings.email}</dd></div>}
      {settings.phone && <div><dt>Phone {settings.isSample && <SampleBadge />}</dt><dd>{settings.phone}</dd></div>}
      {settings.socials.length > 0 && (
        <div>
          <dt>Follow us {settings.isSample && <SampleBadge />}</dt>
          <dd>{settings.socials.map((s) => s.url
            ? <a key={s.label} href={s.url} rel="noopener noreferrer" target="_blank">{s.label}</a>
            : <span key={s.label}>{s.label}</span>)}</dd>
        </div>
      )}
      {!settings.email && !settings.phone && <div><dt>Email and phone</dt><dd>Contact details will be added soon.</dd></div>}
    </dl>
  );
}
