import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, PhotoGrid, Section } from "@/components/blocks";
import { getEvents, getPhotos } from "@/content";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Gallery", description: "Photos from Star Club events." };

export default async function Gallery() {
  const events = await getEvents();
  const all = await getPhotos();
  const groups = [
    ...events.map((e) => ({ key: e.slug, title: e.title, href: `/events/${e.slug}`, photos: all.filter((p) => p.eventSlug === e.slug) })),
    { key: "other", title: "More photos", href: "", photos: all.filter((p) => !p.eventSlug) },
  ].filter((g) => g.photos.length);
  return (
    <>
      <PageIntro title="Gallery" />
      {groups.length ? groups.map(({ key, title, href, photos }) => (
        <Section key={key} title={title} action={href ? <Link href={href}>Event details</Link> : undefined}>
          <PhotoGrid photos={photos} />
        </Section>
      )) : <Section title="Event photos"><p>Photos will be added soon.</p></Section>}
    </>
  );
}
