import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Section } from "@/components/blocks";

export const metadata: Metadata = { title: "Privacy", description: "How Star Club handles personal information and photos." };

export default function Privacy() {
  return (
    <>
      <PageIntro title="Privacy notice" />
      <Section title="Membership applications">
        <div className="prose">
          <p>Applications are collected with Google Forms, so Google also processes what you submit. The form is expected to ask for your name, contact details, address, age confirmation, interests and consent.</p>
          <p>We use this information to review your application and contact you about it. Only the club’s two website administrators can see the responses.</p>
          <p>Unsuccessful applications are deleted after 6 months.</p>
        </div>
      </Section>
      <Section title="Photos and names" tone="soft">
        <div className="prose">
          <p>Committee names are listed only with each person’s agreement. Photos of identifiable children need a parent or guardian’s consent.</p>
        </div>
      </Section>
      <Section title="Website visits">
        <p className="prose">We have not added advertising or analytics trackers. Our hosting provider may keep technical logs, such as IP addresses, to run and protect the website.</p>
      </Section>
      <Section title="Corrections and removal">
        <p className="prose">To ask us to correct or remove your information or a photo, <Link href="/contact">contact the club</Link>.</p>
      </Section>
    </>
  );
}
