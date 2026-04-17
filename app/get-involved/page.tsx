import Image from "next/image";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { getCmsContent } from "@/lib/cms";
import { getSiteContent } from "@/lib/site-cms";
import { Metadata } from "next";
import { GetInvolvedForm } from "@/app/get-involved/get-involved-form";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Australia's premier Solana community. Connect with builders, designers, and founders across the continent.",
  alternates: {
    canonical: "/get-involved",
  },
  openGraph: {
    title: "Get Involved | Superteam Australia",
    description:
      "Australia's premier Solana community. Connect with builders, designers, and founders across the continent.",
    url: "/get-involved",
    images: ["/logo-mark.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Involved | Superteam Australia",
    description:
      "Australia's premier Solana community. Connect with builders, designers, and founders across the continent.",
    images: ["/logo-mark.svg"],
  },
};

export default async function GetInvolvedPage() {
  const [content, site] = await Promise.all([getCmsContent(), getSiteContent()]);
  const gi = site.getInvolvedPage;
  const heroRoles = site.primaryRoles.slice(0, 4);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-bg text-text">
      {/* Figma 2:602–605 — ambient blur blobs */}
      <div
        className="pointer-events-none absolute -left-[200px] -top-[200px] z-0 size-[800px] rounded-[400px] bg-[rgba(104,222,135,0.1)] blur-[60px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[454px] left-64 z-0 size-[800px] rounded-[400px] bg-[rgba(255,185,83,0.05)] blur-[60px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[-400px] top-[957px] z-0 size-[800px] rounded-[400px] bg-[rgba(104,222,135,0.05)] blur-[60px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[200px] right-[-300px] z-0 size-[800px] rounded-[400px] bg-[rgba(255,185,83,0.05)] blur-[60px]"
        aria-hidden
      />

      {/* Organic vector + subtle grain — matches Figma + your asset */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.07] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <Image
        src="/get-involved-bg.svg"
        alt=""
        aria-hidden
        width={520}
        height={520}
        className="pointer-events-none absolute -right-24 top-1/4 z-0 w-[min(520px,90vw)] max-w-none opacity-[0.12] mix-blend-screen"
      />

      <div className="relative z-10">
        <Navbar navLinks={content.navLinks} activeHref="/get-involved" />

        <section className="relative px-6 pb-24 pt-24 sm:pt-28">
          <Container className="max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[minmax(320px,420px)_minmax(0,896px)] lg:items-start">
              <Reveal className="lg:sticky lg:top-28">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-[17px] py-[7px] backdrop-blur-sm">
                  <span className="size-2 rounded-full bg-gold" />
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-gold">{gi.joinBadge}</span>
                </div>
                <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-text sm:text-6xl sm:leading-[1.05] sm:tracking-[-0.05em] xl:text-[72px] xl:leading-[72px]">
                  <span className="text-text">{gi.joinTitlePrefix}</span>
                  <span className="bg-gradient-to-br from-green to-gold bg-clip-text text-transparent">{gi.joinTitleGradient}</span>
                </h1>
                <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-muted sm:text-xl">{gi.pageSubtitle}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {heroRoles.map((role) => (
                    <Badge key={role.value} className="border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[10px] text-white/78">
                      {role.label}
                    </Badge>
                  ))}
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-[1.75rem] border border-white/[0.06] bg-white/[0.025] p-5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Why Join</div>
                    <p className="mt-3 text-sm leading-7 text-muted">
                      Meet builders, operators, and founders across Australia working on the next generation of Solana products.
                    </p>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/[0.06] bg-white/[0.025] p-5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-green">Application Flow</div>
                    <p className="mt-3 text-sm leading-7 text-muted">
                      A short three-step application covering who you are, what you’re building, and what you want from the community.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="w-full">
                <div className="rounded-[2rem] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-1 shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
                  <div className="rounded-[1.7rem] border border-white/[0.045] bg-[rgba(13,16,20,0.62)] p-4 backdrop-blur-xl sm:p-6">
                    <GetInvolvedForm site={site} />
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <Footer variant="getInvolved" meta={site.footerMeta} links={site.footerLinks} />
      </div>
    </main>
  );
}
