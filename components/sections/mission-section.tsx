"use client";

import { Briefcase, Building2, CircleDollarSign, Users, Handshake, Megaphone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { MissionCard } from "@/lib/types";

const icons = [Briefcase, CircleDollarSign, Megaphone, Users, Building2, Handshake];

export function MissionSection({ missionCards }: { missionCards: MissionCard[] }) {
  return (
    <section className="relative py-24">
      <Container>
        <Reveal>
          <SectionHeading title="What We Do" subtitle="A tight operating system for builders, founders, and ecosystem teams shipping from Australia." />
        </Reveal>
        <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {missionCards.map((card, index) => {
            const Icon = icons[index % icons.length];
            return (
              <StaggerItem key={card.id}>
                <div className="spotlight-card group h-full rounded-[2rem] p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20">
                  <div className="flex items-center">
                    <Icon className={`h-8 w-8 ${index % 2 === 0 ? "text-green" : "text-gold"}`} />
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-bold tracking-tight text-text">{card.title}</h3>
                  <p className="mt-4 text-base leading-7 text-muted">{card.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
