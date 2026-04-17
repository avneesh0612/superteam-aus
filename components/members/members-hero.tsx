import { Container } from "@/components/ui/container";
import type { MembersPageCopy } from "@/lib/types";

type Props = {
  copy: MembersPageCopy;
};

export function MembersHero({ copy }: Props) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="section-blur-green absolute -left-24 -top-24 h-[24rem] w-[24rem] rounded-full blur-3xl" />
      <div className="section-blur-gold absolute right-[-5rem] top-24 h-[24rem] w-[24rem] rounded-full blur-3xl" />

      <Container className="relative text-center">
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-text sm:text-7xl">
          {copy.titleBefore}
          <span className="hero-gradient-text">{copy.titleHighlight}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted sm:text-2xl">{copy.subtitle}</p>
      </Container>
    </section>
  );
}
