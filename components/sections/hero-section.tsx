"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FloatingOrb } from "@/components/ui/reveal";
import type { HeroContent } from "@/lib/types";
import { motion } from "framer-motion";

type Props = {
  hero: HeroContent;
};

export function HeroSection({ hero }: Props) {
  return (
    <section className="relative overflow-hidden pb-24 pt-20 sm:pb-32 sm:pt-28">
      <FloatingOrb className="section-blur-green -left-24 -top-20 h-[28rem] w-[28rem]" duration={14} />
      <FloatingOrb className="section-blur-gold right-[-4rem] top-24 h-[25rem] w-[25rem]" duration={16} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <Container className="relative">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute inset-x-[12%] top-0 h-40 rounded-full bg-green/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-[14%] h-28 w-28 rounded-full bg-gold/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="noise-ring mx-auto inline-flex rounded-full bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold"
        >
          {hero.badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45 }}
          className="mx-auto mt-8 max-w-4xl font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] text-text sm:text-7xl md:text-8xl"
        >
          <span className="text-text">{hero.headlineL1Prefix}</span>
          <span className="hero-gradient-text">{hero.headlineL1Highlight}</span>
          <br />
          <span className="hero-gradient-text">{hero.headlineL2Highlight}</span>
          <span className="text-text">{hero.headlineL2Suffix}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-muted sm:text-2xl sm:leading-10"
        >
          {hero.subtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button href={hero.primaryHref} className="min-w-[180px] rounded-full px-7 py-3.5 shadow-[0_10px_40px_rgba(104,222,135,0.18)]">
            {hero.primaryButtonLabel}
          </Button>
          <Button href={hero.secondaryHref} variant="secondary" className="min-w-[180px] rounded-full border-white/10 bg-white/[0.04] px-7 py-3.5">
            {hero.secondaryButtonLabel}
          </Button>
        </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45 }}
            className="mx-auto mt-12 grid max-w-3xl gap-3 text-left sm:grid-cols-3"
          >
            {[
              ["Sydney to Singapore", "Signals, capital, and introductions across APAC."],
              ["Built for operators", "Less hype, more builder momentum and sharp feedback loops."],
              ["Always in motion", "Meetups, bounties, grants, and real-world shipping energy."],
            ].map(([title, copy]) => (
              <div key={title} className="spotlight-card rounded-[1.5rem] px-5 py-5 transition duration-300 hover:-translate-y-1 hover:border-white/20">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{title}</div>
                <p className="mt-3 text-sm leading-6 text-muted">{copy}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
