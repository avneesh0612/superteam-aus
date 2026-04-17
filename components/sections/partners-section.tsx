"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { Partner } from "@/lib/types";
import { motion } from "framer-motion";

export function PartnersSection({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  const marqueePartners = [...partners, ...partners, ...partners];
  const localPartnerLogos = [
    "/partner-02.webp",
    "/partner-03.webp",
    "/partner-04.webp",
    "/partner-05.webp",
    "/partner-06.webp",
    "/partner-07.webp",
  ];

  return (
    <section className="relative py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(29,155,240,0.12),transparent_55%)]" />

      <Reveal>
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.35em] text-white/45">Ecosystem & Partners</p>
      </Reveal>

      <div className="relative left-1/2 mt-10 w-dvw -translate-x-1/2 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0b1017] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0b1017] to-transparent" />

        <div className="partners-marquee flex w-max items-center gap-0 px-0 py-3">
          {marqueePartners.map((partner, index) => {
            const fallbackLogoSrc = localPartnerLogos[index % localPartnerLogos.length];
            const logoSrc = partner.logoUrl || fallbackLogoSrc;

            return (
              <motion.a
                key={`${partner.id}-${index}`}
                href={partner.websiteUrl || undefined}
                target={partner.websiteUrl ? "_blank" : undefined}
                rel={partner.websiteUrl ? "noreferrer noopener" : undefined}
                whileHover={{ scale: 1.03 }}
                aria-label={partner.websiteUrl ? `Visit ${partner.name}` : partner.name}
                className="flex h-24 min-w-[210px] shrink-0 items-center justify-center px-0 text-center sm:min-w-[240px] md:min-w-[280px]"
              >
                <div className="relative h-14 w-[170px] overflow-hidden sm:h-16 sm:w-[190px] md:h-[72px] md:w-[220px]">
                  <Image
                    src={logoSrc}
                    alt={partner.name}
                    fill
                    sizes="(min-width: 768px) 220px, 170px"
                    className="object-cover object-center opacity-95 transition-opacity duration-200 hover:opacity-100"
                  />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
