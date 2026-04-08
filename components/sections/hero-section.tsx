"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-24 pt-20 sm:pb-32 sm:pt-28">
      <div className="section-blur-green absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full blur-3xl" />
      <div className="section-blur-gold absolute right-[-6rem] top-24 h-[28rem] w-[28rem] rounded-full blur-3xl" />

      <Container className="relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto inline-flex rounded-full border border-[#3e4a3e]/40 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold"
        >
          The Southern Light
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45 }}
          className="mx-auto mt-8 max-w-4xl font-display text-5xl font-extrabold leading-none tracking-tight text-text sm:text-7xl md:text-8xl"
        >
          The Home of <span className="hero-gradient-text">Solana</span>
          <br />
          <span className="hero-gradient-text">Builders</span> in Australia.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-muted sm:text-2xl sm:leading-10"
        >
          Accelerating founders, builders, creatives, and institutions exploring internet capital markets on Solana.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button href="/get-involved">Get Involved</Button>
          <Button href="/members" variant="secondary">Explore Opportunities</Button>
        </motion.div>
      </Container>
    </section>
  );
}
