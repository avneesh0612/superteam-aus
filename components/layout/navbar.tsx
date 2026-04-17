import Link from "next/link";
import Image from "next/image";
import { NavLink } from "@/lib/types";
import { cn } from "@/lib/utils";

type NavbarProps = {
  navLinks: NavLink[];
  /** Highlights the nav link whose `href` matches (e.g. `/get-involved`). */
  activeHref?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function Navbar({ navLinks, activeHref, ctaHref = "/get-involved", ctaLabel }: NavbarProps) {
  const resolvedCtaLabel = ctaLabel || "Get Involved";
  const displayLinks = navLinks.some((link) => link.href === ctaHref)
    ? navLinks
    : [...navLinks, { label: resolvedCtaLabel, href: ctaHref }];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[rgba(18,19,22,0.6)] backdrop-blur-[12px]">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-mark.svg"
            alt="Superteam Australia"
            width={160}
            height={40}
            className="h-8 w-auto object-contain sm:h-9"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {displayLinks.map((link) => {
            const isActive = activeHref != null && link.href === activeHref;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "border-b-2 border-transparent pb-1.5 font-display text-base tracking-[-0.025em] transition",
                  isActive ? "border-[#72dc8c] text-[#72dc8c]" : "text-[#9ca3af] hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
