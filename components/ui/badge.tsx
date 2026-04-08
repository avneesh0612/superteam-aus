import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full border border-white/5 bg-panel2 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-text", className)}>
      {children}
    </span>
  );
}
