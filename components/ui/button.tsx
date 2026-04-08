import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark";
  className?: string;
};

export function Button({ href = "#", children, variant = "primary", className }: ButtonProps) {
  const styles = {
    primary: "bg-green text-deepgreen hover:opacity-90",
    secondary: "border border-white/10 bg-white/5 text-text hover:bg-white/10",
    dark: "bg-deepgreen text-white hover:opacity-90",
  };

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition",
        styles[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}
