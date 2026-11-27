import LinkButton from "@/components/LinkButton";
import { EventCard, NoticeList, PhotoGrid, SampleBadge, Section, SponsorGrid } from "@/components/blocks";
import { club, getNotices, getPhotos, getSettings, splitEvents } from "@/content";
import Link from "next/link";

export const revalidate = 3600; // keeps upcoming/past correct as dates change

export default function Home() {
  const { upcoming, past } = splitEvents();
  const featured = upcoming[0] ?? past[0];
  const photos = getPhotos().slice(0, 6);
  const notices = getNotices().slice(0, 3);
  const settings = getSettings();

  return (
    <>
      <div className="hero">
        <div className="container">
          <h1>{club.name}, Gobaraiya</h1>
          <p>A club in Kanchanpur focusing on sports and creative activities for youth and the community.</p>
          <div className="actions">
            <LinkButton href="/join" type="primary" size="large">Apply for membership</LinkButton>
            <LinkButton href="/events" size="large">View events</LinkButton>
          </div>
          <p className="note">{club.registration}</p>
        </div>
      </div>

      <Section title="Our focus">
        <div className="grid grid-2">
          <article className="card"><h3>Sports</h3><p>Bringing players and teams together, including through our futsal cup.</p></article>
          <article className="card"><h3>Creative activities</h3><p>Our second focus for the first year. Activities will be shared here once announced.</p></article>
        </div>
      </Section>

      {featured && (
        <Section title={upcoming.length ? "Next event" : "Latest event"} tone="soft" action={<Link href="/events">All events</Link>}>
          <EventCard event={featured} />
        </Section>
      )}

      {upcoming.length > 0 && past[0] && <Section title="Latest past event"><EventCard event={past[0]} /></Section>}

      {photos.length > 0 && (
        <Section title="Photos" action={<Link href="/gallery">Open gallery</Link>}><PhotoGrid photos={photos} /></Section>
      )}

      {notices.length > 0 && (
        <Section title="Notices" tone="soft" action={<Link href="/notices">All notices</Link>}><NoticeList notices={notices} /></Section>
      )}

      {featured && featured.sponsors.length > 0 && (
        <Section title="Event sponsors">
          <p>Businesses that sponsored the {featured.title}.</p>
          <SponsorGrid sponsors={featured.sponsors} />
        </Section>
      )}

      <Section title="Support us" tone="soft">
        <p className="prose">Interested in supporting Star Club’s sports and creative activities? Talk to us about sponsoring a future event.</p>
        <LinkButton href="/contact#support" type="primary">Contact us about support</LinkButton>
      </Section>

      <Section title="Join and follow">
        {settings.socials.length > 0 ? (
          <p>
            Follow us: {settings.socials.map((s) => s.url
              ? <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label} </a>
              : <span key={s.label}>{s.label} <SampleBadge /></span>)}
          </p>
        ) : <p>Social media links will be added soon.</p>}
        <LinkButton href="/join" type="primary">Apply for membership</LinkButton>
      </Section>
    </>
  );
}
