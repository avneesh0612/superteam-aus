"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FloatingOrb, Reveal } from "@/components/ui/reveal";
import type { CtaContent } from "@/lib/types";

type Props = {
  cta: CtaContent;
};

export function CTASection({ cta }: Props) {
  return (
    <section className="relative pb-24">
      <FloatingOrb className="section-blur-green left-[8%] top-8 h-32 w-32 opacity-80" duration={11} />
      <FloatingOrb className="section-blur-gold right-[10%] top-20 h-40 w-40 opacity-70" duration={15} />
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#121316_0%,#14202b_52%,#17291d_100%)] px-6 py-16 text-center text-white shadow-card sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(114,220,140,0.18),transparent_35%)]" />
          <div className="absolute inset-y-8 right-8 w-56 rounded-full bg-[#1d9bf0]/10 blur-3xl" />
          <h2 className="relative font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            {cta.titleLine1}
            <br />
            {cta.titleLine2}
          </h2>
          <p className="relative mx-auto mt-5 max-w-2xl text-base font-medium text-white/70 sm:text-xl">{cta.description}</p>

          <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/get-involved#get-involved-application" className="rounded-full px-7 py-3.5">
              Join Now
            </Button>
            <Button href={cta.twitterUrl} variant="secondary" className="rounded-full border-white/15 bg-white/[0.04] px-7 py-3.5 text-white hover:bg-white/[0.08]">
              Follow on X
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
