import Link from "next/link";
import { PageIntro, Section } from "@/components/blocks";

export default function NotFound() {
  return (
    <>
      <PageIntro title="Page not found" />
      <Section title="Where to next"><p><Link href="/">Go to the home page</Link> or <Link href="/events">see events</Link>.</p></Section>
    </>
  );
}
