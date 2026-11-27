import type { Metadata } from "next";
import { EventCard, PageIntro, Section } from "@/components/blocks";
import { splitEvents } from "@/content";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Events", description: "Upcoming and past Star Club events." };

export default async function Events() {
  const { upcoming, past } = await splitEvents();
  return (
    <>
      <PageIntro title="Events" />
      <Section title="Upcoming">
        {upcoming.length ? <div className="grid grid-2">{upcoming.map((e) => <EventCard key={e.slug} event={e} />)}</div>
          : <p>No upcoming event has been announced yet.</p>}
      </Section>
      <Section title="Past events" tone="soft">
        {past.length ? <div className="grid grid-2">{past.map((e) => <EventCard key={e.slug} event={e} />)}</div>
          : <p>Past events will appear here.</p>}
      </Section>
    </>
  );
}
