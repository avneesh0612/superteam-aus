import { Container } from "@/components/ui/container";

export function MembersHero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="section-blur-green absolute -left-24 -top-24 h-[24rem] w-[24rem] rounded-full blur-3xl" />
      <div className="section-blur-gold absolute right-[-5rem] top-24 h-[24rem] w-[24rem] rounded-full blur-3xl" />

      <Container className="relative text-center">
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-text sm:text-7xl">
          Meet the <span className="hero-gradient-text">Builders</span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted sm:text-2xl">
          A simple first-pass members showcase for the Superteam Australia ecosystem.
        </p>
      </Container>
    </section>
  );
}
