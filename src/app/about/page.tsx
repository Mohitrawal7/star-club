import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, SampleBadge, Section } from "@/components/blocks";
import { club, getCommittee } from "@/content";

export const metadata: Metadata = { title: "About", description: "Who Star Club is, what it focuses on, and its working committee." };

export default function About() {
  const committee = getCommittee();
  return (
    <>
      <PageIntro title="About Star Club" />
      <Section title="Who we are">
        <p className="prose">Star Club is based in {club.location}. Our focus for the first year is sports and creative activities.</p>
      </Section>
      <Section title="Registration status" tone="soft"><p>{club.registration}</p></Section>
      <Section title="Working committee">
        {committee.names.length ? (
          <>
            {committee.sample && <p><SampleBadge /> These are placeholders, not real people.</p>}
            <ul className="names">{committee.names.map((n) => <li key={n}>{n}</li>)}</ul>
          </>
        ) : <p>Committee names will be added soon.</p>}
        <p><Link href="/join">Apply for membership</Link> or <Link href="/contact">contact the club</Link>.</p>
      </Section>
    </>
  );
}
