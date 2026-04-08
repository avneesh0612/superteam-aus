export function SectionHeading({
  title,
  subtitle,
  accent = "green",
}: {
  title: string;
  subtitle?: string;
  accent?: "green" | "gold";
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-5xl">{title}</h2>
      <div className={`mx-auto mt-5 h-1.5 w-20 rounded-full ${accent === "green" ? "bg-green" : "bg-gold"}`} />
      {subtitle ? <p className="mt-5 text-base text-muted sm:text-lg">{subtitle}</p> : null}
    </div>
  );
}
