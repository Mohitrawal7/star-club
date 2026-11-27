import { ArrowRightOutlined, BgColorsOutlined, CameraOutlined, StarFilled, TrophyOutlined } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";
import LinkButton from "@/components/LinkButton";
import { NoticeList, PhotoGrid, SampleBadge, Section, SponsorGrid, eventDates } from "@/components/blocks";
import { club, getNotices, getPhotos, getSettings, splitEvents } from "@/content";

export const revalidate = 3600; // keeps upcoming/past correct as dates change

export default async function Home() {
  const { upcoming, past } = await splitEvents();
  const featured = upcoming[0] ?? past[0];
  const photos = (await getPhotos()).slice(0, 6);
  const notices = (await getNotices()).slice(0, 3);
  const settings = await getSettings();
  const featuredPhoto = featured ? (await getPhotos(featured.slug))[0] : undefined;
  const featuredImage = featuredPhoto?.src ?? club.heroImage;

  return (
    <>
      <div className="hero">
        <Image src={club.heroImage} alt={club.heroImageAlt} fill sizes="100vw" preload unoptimized={club.heroImage.endsWith(".svg")} className="cover" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-name"><StarFilled aria-hidden="true" /> {club.name}</p>
            <h1>Sports and creativity in Gobaraiya</h1>
            <p className="hero-lead">A club in Kanchanpur for youth and the community.</p>
            <div className="actions">
              <LinkButton href="/join" type="primary" size="large">Apply for membership</LinkButton>
              <LinkButton href="/events" size="large" ghost>View events</LinkButton>
            </div>
            <p className="hero-note">{settings.registration}</p>
          </div>
          <Link href="/gallery" className="hero-round">
            <span><CameraOutlined aria-hidden="true" /></span>
            See photos
          </Link>
        </div>
      </div>

      <Section title="What we’re focusing on">
        <div className="focus">
          <article className="focus-tile focus-sports">
            <TrophyOutlined aria-hidden="true" className="focus-icon" />
            <h3>Sports</h3>
            <p>Bringing players and teams together, including through our futsal cup.</p>
          </article>
          <article className="focus-tile focus-creative">
            <BgColorsOutlined aria-hidden="true" className="focus-icon" />
            <h3>Creative activities</h3>
            <p>Our second focus for the first year. Activities will be shared here once announced.</p>
          </article>
        </div>
      </Section>

      {featured && (
        <section className="feature">
          <div className="container feature-grid">
            <div>
              <p className="feature-kicker">{upcoming.length ? "Next event" : "Our latest event"}</p>
              <h2>{featured.title}</h2>
              <p>{eventDates(featured)}<br />{featured.venue}</p>
              {featured.facts.length > 0 && (
                <dl className="stats">
                  {featured.facts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
                </dl>
              )}
              {featured.format && <p>{featured.format}</p>}
              <LinkButton href={`/events/${featured.slug}`} type="primary" size="large">
                Event details <ArrowRightOutlined aria-hidden="true" />
              </LinkButton>
            </div>
            <Image src={featuredImage} alt={featuredPhoto?.alt ?? ""} width={800} height={600}
              unoptimized={featuredImage.endsWith(".svg")} sizes="(max-width: 920px) 100vw, 560px" className="feature-image" />
          </div>
        </section>
      )}

      {upcoming.length > 0 && past[0] && (
        <Section title="Latest past event"><p><Link href={`/events/${past[0].slug}`}>{past[0].title}</Link></p></Section>
      )}

      {photos.length > 0 && (
        <Section title="Moments from the club" action={<Link href="/gallery">Open gallery</Link>}>
          <div className="mosaic"><PhotoGrid photos={photos.slice(0, 5)} /></div>
        </Section>
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

      <section className="support">
        <div className="container">
          <h2>Support us</h2>
          <p>Interested in supporting Star Club’s sports and creative activities? Talk to us about sponsoring a future event.</p>
          <LinkButton href="/contact#support" size="large" ghost>Contact us about support</LinkButton>
        </div>
      </section>

      <section className="join">
        <div className="container join-row">
          <div>
            <h2>Join and follow</h2>
            {settings.socials.length > 0 ? (
              <p>
                Follow us: {settings.socials.map((s) => s.url
                  ? <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label} </a>
                  : <span key={s.label}>{s.label} <SampleBadge /></span>)}
              </p>
            ) : <p>Social media links will be added soon.</p>}
          </div>
          <LinkButton href="/join" size="large">Apply for membership</LinkButton>
        </div>
      </section>
    </>
  );
}
