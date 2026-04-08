import Link from "next/link";
import { Container } from "@/components/ui/container";

type FooterProps = {
  variant?: "default" | "getInvolved";
};

export function Footer({ variant = "default" }: FooterProps) {
  if (variant === "getInvolved") {
    return (
      <footer className="border-t border-[rgba(62,74,62,0.1)] bg-bg py-16">
        <Container className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xl font-semibold text-gold">Superteam Australia</div>
            <p className="mt-4 max-w-md text-sm leading-5 text-gray-500">
              © 2024 Superteam Australia. Built for the high-end digital frontier.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-sm text-gray-500">
            <Link href="https://x.com/SuperteamAU" className="hover:text-muted">
              Twitter
            </Link>
            <Link href="#" className="hover:text-muted">
              Discord
            </Link>
            <Link href="#" className="hover:text-muted">
              Telegram
            </Link>
            <Link href="https://superteam.fun" className="hover:text-muted">
              Superteam Global
            </Link>
            <Link href="#" className="hover:text-muted">
              Privacy Policy
            </Link>
          </div>
        </Container>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/5 bg-bg py-16">
      <Container className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="font-display text-lg font-bold text-gold">Superteam Australia</div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
            The home of Solana builders in Australia. A simple v1 build based on the provided Figma.
          </p>
        </div>

        <div className="flex gap-8 text-sm text-gray-500">
          <Link href="/">Landing</Link>
          <Link href="/members">Members</Link>
          <Link href="/get-involved">Get Involved</Link>
          <Link href="https://superteam.fun">Global Superteam</Link>
          <Link href="https://x.com/SuperteamAU">Twitter</Link>
        </div>
      </Container>
    </footer>
  );
}
