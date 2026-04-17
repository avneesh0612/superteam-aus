import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { FooterLink, FooterMeta } from "@/lib/types";

type FooterProps = {
  variant?: "default" | "getInvolved";
  meta: FooterMeta;
  links: FooterLink[];
};

export function Footer({ variant = "default", meta, links }: FooterProps) {
  const variantKey = variant === "getInvolved" ? "get_involved" : "default";
  const filtered = links.filter((l) => l.variant === variantKey && !["Discord", "Telegram"].includes(l.label));
  const tagline = variant === "getInvolved" ? meta.taglineGetInvolved : meta.taglineDefault;

  if (variant === "getInvolved") {
    return (
      <footer className="border-t border-[rgba(62,74,62,0.1)] bg-bg py-16">
        <Container className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xl font-semibold text-gold">{meta.brandName}</div>
            <p className="mt-4 max-w-md text-sm leading-5 text-gray-500">
              © {meta.copyrightYear} {meta.brandName}. {tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-sm text-gray-500">
            {filtered.map((link) => (
              <Link key={link.id} href={link.href} className="hover:text-muted">
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/5 bg-bg py-16">
      <Container className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="font-display text-lg font-bold text-gold">{meta.brandName}</div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">{tagline}</p>
        </div>

        <div className="flex flex-wrap gap-8 text-sm text-gray-500">
          {filtered.map((link) => (
            <Link key={link.id} href={link.href} className="hover:text-muted">
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
