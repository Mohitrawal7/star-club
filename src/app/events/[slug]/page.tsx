import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LinkButton from "@/components/LinkButton";
import { PageIntro, PhotoGrid, SampleBadge, Section, SponsorGrid, eventDates } from "@/components/blocks";
import { getEvent, getEvents, getPhotos } from "@/content";
import { todayInNepal } from "@/lib/dates";

export const revalidate = 3600;
export const generateStaticParams = async () => (await getEvents()).map((e) => ({ slug: e.slug }));

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  return event ? { title: event.title, description: event.summary } : {};
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const event = await getEvent((await params).slug);
  if (!event) notFound();

  const photos = await getPhotos(event.slug);
  const today = todayInNepal();
  const open = event.registrationUrl && event.endDate >= today &&
    (!event.registrationDeadline || event.registrationDeadline >= today);
  const facts = [
    { label: "Date", value: eventDates(event) },
    { label: "Venue", value: event.venue },
    { label: "Organizer", value: event.organizer },
    ...event.facts,
  ];

  return (
    <>
      <PageIntro title={event.title}>{event.summary}</PageIntro>
      <Section title="Event details">
        <dl className="facts prose">{facts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl>
        {open && <LinkButton href={event.registrationUrl!} type="primary">Register for this event</LinkButton>}
      </Section>
      {event.description && <Section title="About the event"><p className="prose preline">{event.description}</p></Section>}
      {event.format && <Section title="Format" tone="soft"><p className="prose">{event.format}</p></Section>}
      {event.results && (
        <Section title="Results">
          {event.results.sample && <p><SampleBadge /> These results are placeholders, not the real outcome.</p>}
          <dl className="facts prose">{event.results.items.map((r, i) => <div key={`${r.label}-${i}`}><dt>{r.label}</dt><dd>{r.value}</dd></div>)}</dl>
        </Section>
      )}
      {photos.length > 0 && <Section title="Photos"><PhotoGrid photos={photos} /></Section>}
      {event.sponsors.length > 0 && (
        <Section title="Sponsors of this event" tone="soft">
          <SponsorGrid sponsors={event.sponsors} />
          {event.sponsorNote && <p style={{ marginTop: 16 }}>{event.sponsorNote}</p>}
        </Section>
      )}
    </>
  );
}
