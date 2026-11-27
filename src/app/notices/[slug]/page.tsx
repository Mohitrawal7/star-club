import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro, SampleBadge } from "@/components/blocks";
import { getNotices } from "@/content";
import { formatDate } from "@/lib/dates";

export const revalidate = 3600;
export const generateStaticParams = () => getNotices().map((n) => ({ slug: n.slug }));
const find = (slug: string) => getNotices().find((n) => n.slug === slug);

export async function generateMetadata({ params }: PageProps<"/notices/[slug]">): Promise<Metadata> {
  return { title: find((await params).slug)?.title };
}

export default async function NoticePage({ params }: PageProps<"/notices/[slug]">) {
  const notice = find((await params).slug);
  if (!notice) notFound();
  return (
    <>
      <PageIntro title={notice.title}>{formatDate(notice.publishedAt)} {notice.sample && <SampleBadge />}</PageIntro>
      <article className="section"><div className="container prose">{notice.body.map((p) => <p key={p}>{p}</p>)}</div></article>
    </>
  );
}
