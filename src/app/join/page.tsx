import type { Metadata } from "next";
import Link from "next/link";
import LinkButton from "@/components/LinkButton";
import { PageIntro, SampleBadge, Section } from "@/components/blocks";
import { getSettings } from "@/content";

export const metadata: Metadata = { title: "Join Us", description: "Apply for Star Club membership." };

export default function Join() {
  const { membershipFormUrl, isSample } = getSettings();
  return (
    <>
      <PageIntro title="Apply for membership">Sending an application does not make you a member.</PageIntro>
      <Section title="Before you apply">
        <ul className="prose">
          <li>Membership rules are being finalised. Conditions, including a minimum age, may apply.</li>
          <li>The working committee reviews applications.</li>
          <li>Do not send citizenship documents.</li>
          <li>The form is run on Google Forms. Read our <Link href="/privacy">privacy notice</Link> first.</li>
        </ul>
        {membershipFormUrl
          ? <LinkButton href={membershipFormUrl} type="primary" size="large">Open application form</LinkButton>
          : <p><strong>Applications opening soon.</strong> {isSample && <><SampleBadge /> The real form link will go here.</>}</p>}
      </Section>
    </>
  );
}
