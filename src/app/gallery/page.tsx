import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, PhotoGrid, Section } from "@/components/blocks";
import { getEvents, getPhotos } from "@/content";

export const metadata: Metadata = { title: "Gallery", description: "Photos from Star Club events." };

export default function Gallery() {
  const groups = getEvents().map((event) => ({ event, photos: getPhotos(event.slug) })).filter((g) => g.photos.length);
  return (
    <>
      <PageIntro title="Gallery" />
      {groups.length ? groups.map(({ event, photos }) => (
        <Section key={event.slug} title={event.title} action={<Link href={`/events/${event.slug}`}>Event details</Link>}>
          <PhotoGrid photos={photos} />
        </Section>
      )) : <Section title="Event photos"><p>Photos will be added soon.</p></Section>}
    </>
  );
}
