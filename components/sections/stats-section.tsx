import { Container } from "@/components/ui/container";
import { Stat } from "@/lib/types";

export function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <section className="pb-24">
      <Container>
        <div className="grid gap-6 rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 shadow-card backdrop-blur-md sm:grid-cols-2 sm:p-10 lg:grid-cols-5">
          {stats.map((stat, index) => (
            <div key={stat.id} className="text-center">
              <div className={`font-display text-4xl font-bold ${index % 2 === 0 ? "text-green" : "text-gold"}`}>
                {stat.value}
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
