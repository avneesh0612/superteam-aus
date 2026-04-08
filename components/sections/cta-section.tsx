import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function CTASection() {
  return (
    <section className="pb-24">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-green to-[#29a556] px-6 py-16 text-center text-deepgreen shadow-card sm:px-10">
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            Ready to Build
            <br />
            the Frontier?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-deepgreen/80 sm:text-xl">
            Join the strongest Solana community in the APAC region.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="https://t.me" variant="dark">Telegram</Button>
            <Button href="https://discord.com" variant="dark">Discord</Button>
            <Button href="https://x.com/SuperteamAU" variant="dark">Twitter / X</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
