import type { Metadata } from "next";
import { ContactDetails, PageIntro, Section } from "@/components/blocks";
import { getSettings } from "@/content";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Contact", description: "Contact Star Club or ask about supporting its activities." };

export default async function Contact() {
  const settings = await getSettings();
  return (
    <>
      <PageIntro title="Contact us" />
      <Section title="Get in touch"><div className="prose"><ContactDetails settings={settings} /></div></Section>
      <div id="support">
        <Section title="Support us" tone="soft">
          <p className="prose">If you or your business would like to sponsor or support a future event, contact the club using the details above.</p>
          {!settings.email && !settings.phone && <p>Our contact details will be added soon.</p>}
        </Section>
      </div>
    </>
  );
}
