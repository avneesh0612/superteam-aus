import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Member } from "@/lib/types";
import { Briefcase, Code2, GraduationCap, Rocket, ShieldCheck, Wrench } from "lucide-react";

export function MemberCard({ member }: { member: Member }) {
  const RoleIcon = getRoleIcon(member.role);

  return (
    <article className="spotlight-card overflow-hidden rounded-[2rem] transition duration-300">
      <div className="relative h-64">
        <Image src={member.photo} alt={member.name} fill className="object-cover grayscale transition duration-500 hover:scale-105 hover:grayscale-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
      </div>

      <div className="space-y-5 p-6">
        <div>
          <div>
            <h3 className="font-display text-2xl font-bold text-text">{member.name}</h3>
            <p className="mt-1 text-sm text-gold">
              {member.role}
              {member.company ? ` · ${member.company}` : ""}
            </p>
          </div>

          {member.bio ? <p className="mt-4 text-sm leading-6 text-muted">{member.bio}</p> : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {member.badge ? <Badge className="border-gold/20 text-gold">{member.badge}</Badge> : null}
          {member.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-5">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-green/90 text-deepgreen shadow-[0_8px_24px_rgba(104,222,135,0.35)]">
            <RoleIcon className="h-5 w-5" />
          </div>

          {member.twitterUrl ? (
            <Link
              href={member.twitterUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Visit ${member.name} on X`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.02] text-[#c7d0cc] transition hover:border-white/30 hover:text-white"
            >
              <XLogo className="h-5 w-5" />
            </Link>
          ) : (
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/30">
              <XLogo className="h-5 w-5" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function getRoleIcon(role: string) {
  const normalized = role.toLowerCase();

  if (normalized.includes("founder") || normalized.includes("ceo")) return Rocket;
  if (normalized.includes("student") || normalized.includes("intern")) return GraduationCap;
  if (normalized.includes("builder")) return Wrench;
  if (normalized.includes("developer") || normalized.includes("engineer")) return Code2;
  if (normalized.includes("security") || normalized.includes("audit")) return ShieldCheck;

  return Briefcase;
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.244 2H21.308L14.608 9.648L22.488 22H16.318L11.452 14.458L4.844 22H1.776L8.944 13.807L1.376 2H7.702L12.108 8.895L18.244 2ZM17.168 20.116H18.867L6.778 3.785H4.957L17.168 20.116Z" />
    </svg>
  );
}
