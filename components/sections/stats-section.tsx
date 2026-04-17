"use client";

import { Container } from "@/components/ui/container";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { Stat } from "@/lib/types";

export function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <section className="pb-24">
      <Container>
        <Reveal className="section-shell px-6 py-6 sm:px-10 sm:py-8">
          <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat, index) => (
              <StaggerItem key={stat.id}>
                <div className="rounded-[1.5rem] border border-white/[0.06] bg-black/20 px-5 py-6 text-center transition duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.05]">
                  <div className={`font-display text-4xl font-bold tracking-tight ${index % 2 === 0 ? "text-green" : "text-gold"}`}>
                    {stat.value}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Reveal>
      </Container>
    </section>
  );
}
