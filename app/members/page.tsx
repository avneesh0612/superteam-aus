import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { MembersGrid } from "@/components/members/members-grid";
import { MembersHero } from "@/components/members/members-hero";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getCmsContent } from "@/lib/cms";
import { getSiteContent } from "@/lib/site-cms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members",
  description: "Browse Superteam Australia members by skills, roles, and ecosystem focus.",
  alternates: {
    canonical: "/members",
  },
  openGraph: {
    title: "Members | Superteam Australia",
    description: "Browse Superteam Australia members by skills, roles, and ecosystem focus.",
    url: "/members",
    images: ["/logo-mark.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Members | Superteam Australia",
    description: "Browse Superteam Australia members by skills, roles, and ecosystem focus.",
    images: ["/logo-mark.svg"],
  },
};

export default async function MembersPage() {
  const [content, site] = await Promise.all([getCmsContent(), getSiteContent()]);

  return (
    <main className="min-h-screen bg-bg text-text">
      <Navbar navLinks={content.navLinks} activeHref="/members" />
      <MembersHero copy={site.membersPage} />
      <section className="pb-24">
        <Container>
          <MembersGrid members={content.members} />
        </Container>
      </section>
      <section className="pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(112deg,rgba(18,26,36,0.92)_0%,rgba(13,19,28,0.95)_48%,rgba(32,34,23,0.9)_100%)] px-7 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-10 sm:py-10 lg:px-12">
            <div className="pointer-events-none absolute -right-16 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(110,231,135,0.09),transparent_35%)]" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
              <div className="max-w-2xl">
                <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Want to join the squad?</h2>
                <p className="mt-4 text-base leading-8 text-white/72 sm:text-[1.35rem]">
                  We are always looking for talented builders, designers and operators to help grow the Solana ecosystem in Australia.
                </p>
              </div>

              <Button
                href="/get-involved#get-involved-application"
                className="h-14 rounded-2xl px-10 text-xl font-semibold"
              >
                Apply to Join
              </Button>
            </div>
          </div>
        </Container>
      </section>
      <Footer meta={site.footerMeta} links={site.footerLinks} />
    </main>
  );
}
