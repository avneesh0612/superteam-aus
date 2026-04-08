import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/ui/container";
import { getCmsContent } from "@/lib/cms";
import { Metadata } from "next";
import { GetInvolvedForm } from "@/app/get-involved/get-involved-form";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Australia's premier Solana community. Connect with builders, designers, and founders across the continent.",
};

export default async function GetInvolvedPage() {
  const content = await getCmsContent();

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-bg text-text">
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
      <img
        src="/get-involved-bg.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/4 z-0 w-[min(520px,90vw)] max-w-none opacity-[0.12] mix-blend-screen"
      />

      <div className="relative z-10">
        <Navbar
          navLinks={content.navLinks}
          activeHref="/get-involved"
          ctaHref="/get-involved#get-involved-application"
          ctaLabel="Join Now"
        />

        <section className="relative px-6 pb-24 pt-32">
          <Container className="flex max-w-[896px] flex-col items-center">
            {/* Page header — Figma 2:455 */}
            <div className="flex flex-col items-center gap-6 text-center" data-node-id="2:455">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(62,74,62,0.2)] bg-[#292a2d] px-[17px] py-[7px]">
                <span className="size-2 rounded-full bg-gold" />
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-gold">Join the Elite</span>
              </div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-text sm:text-6xl sm:leading-[1.1] sm:tracking-[-0.05em] md:text-[72px] md:leading-[72px]">
                <span className="text-text">The Southern </span>
                <span className="bg-gradient-to-br from-green to-gold bg-clip-text text-transparent">Frontier</span>
              </h1>
              <p className="max-w-[672px] text-lg leading-relaxed text-muted sm:text-xl">
                Australia&apos;s premier Solana community. Connect with builders, designers, and founders across the
                continent.
              </p>
            </div>

            <div className="mt-20 w-full">
              <GetInvolvedForm />
            </div>
          </Container>
        </section>

        <Footer variant="getInvolved" />
      </div>
    </main>
  );
}
