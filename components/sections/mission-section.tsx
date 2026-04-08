import { Briefcase, Building2, CircleDollarSign, Users, Handshake, Megaphone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MissionCard } from "@/lib/types";

const icons = [Briefcase, CircleDollarSign, Megaphone, Users, Building2, Handshake];

export function MissionSection({ missionCards }: { missionCards: MissionCard[] }) {
  return (
    <section className="relative py-24">
      <Container>
        <SectionHeading title="What We Do" />
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {missionCards.map((card, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={card.id} className="card-surface rounded-[2rem] p-8">
                <Icon className={`h-8 w-8 ${index % 2 === 0 ? "text-green" : "text-gold"}`} />
                <h3 className="mt-5 font-display text-2xl font-bold text-text">{card.title}</h3>
                <p className="mt-4 text-base leading-7 text-muted">{card.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
