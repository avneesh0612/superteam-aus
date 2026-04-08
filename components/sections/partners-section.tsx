import { Container } from "@/components/ui/container";
import { Partner } from "@/lib/types";

export function PartnersSection({ partners }: { partners: Partner[] }) {
  const marqueePartners = [...partners, ...partners];

  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-20">
      <Container>
        <p className="text-center text-xs uppercase tracking-[0.35em] text-muted">Ecosystem & Partners</p>
        <div className="relative mt-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-bg to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-bg to-transparent" />
          <div className="partners-marquee flex w-max gap-5 pr-5">
            {marqueePartners.map((partner, index) => (
              <a
                key={`${partner.id}-${index}`}
                href={partner.websiteUrl || "#"}
                target={partner.websiteUrl ? "_blank" : undefined}
                rel={partner.websiteUrl ? "noreferrer noopener" : undefined}
                className="w-[220px] shrink-0 rounded-2xl border border-white/5 bg-panel/60 px-6 py-6 text-center font-display text-lg font-extrabold tracking-wide text-white/45 transition hover:scale-[1.02] hover:text-white/70"
              >
                {partner.logoUrl ? (
                  <img src={partner.logoUrl} alt={partner.name} className="mx-auto h-10 w-10 rounded-full object-cover" />
                ) : null}
                <div className="mt-3">{partner.name}</div>
                {partner.project ? (
                  <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{partner.project}</div>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
