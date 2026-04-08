import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/lib/types";
import { cn } from "@/lib/utils";

type NavbarProps = {
  navLinks: NavLink[];
  /** Highlights the nav link whose `href` matches (e.g. `/get-involved`). */
  activeHref?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function Navbar({ navLinks, activeHref, ctaHref = "/get-involved", ctaLabel = "Get Involved" }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[rgba(18,19,22,0.6)] backdrop-blur-[12px]">
      <div className="mx-auto flex h-[73px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-green">
          Superteam Australia
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = activeHref != null && link.href === activeHref;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-base tracking-tight transition",
                  isActive ? "border-b-2 border-green pb-1.5 font-bold text-green" : "font-normal text-muted hover:text-text"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Button href={ctaHref} className="rounded-lg px-6 py-2 text-base font-bold">
          {ctaLabel}
        </Button>
      </div>
    </header>
  );
}
