import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource-variable/inter";
import "@fontsource/noto-sans-devanagari/400.css";
import "@fontsource/noto-sans-devanagari/600.css";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import ThemeProvider from "@/components/ThemeProvider";
import { club } from "@/content";
import { showSamples, siteLaunched, siteUrl } from "@/lib/flags";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${club.name} | Gobaraiya, Kanchanpur`, template: `%s | ${club.name}` },
  description: "Official website of Star Club, Gobaraiya, Kanchanpur: sports and creative activities, events, photos and notices.",
  openGraph: { siteName: club.name, type: "website" },
  robots: siteLaunched ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ThemeProvider>
            <a href="#main" className="skip-link">Skip to content</a>
            {showSamples && (
              <p className="sample-banner">Preview: items marked “Sample”, including placeholder photos, are not real.</p>
            )}
            <SiteHeader />
            <main id="main">{children}</main>
            <footer className="footer">
              <div className="container">
                <p className="wordmark">STAR CLUB <span lang="ne">{club.nepaliName}</span></p>
                <p>{club.location}</p>
                <p>{club.registration}</p>
                <p><Link href="/contact">Contact</Link> · <Link href="/privacy">Privacy</Link></p>
              </div>
            </footer>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
