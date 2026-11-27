import type { Metadata } from "next";
import { NoticeList, PageIntro, Section } from "@/components/blocks";
import { getNotices } from "@/content";

export const metadata: Metadata = { title: "Notices", description: "Announcements from Star Club." };

export default function Notices() {
  const notices = getNotices();
  return (
    <>
      <PageIntro title="Notices" />
      <Section title="Latest">{notices.length ? <NoticeList notices={notices} /> : <p>No notices have been published yet.</p>}</Section>
    </>
  );
}
