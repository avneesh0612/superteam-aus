import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Member } from "@/lib/types";

export function MemberCard({ member }: { member: Member }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/5 bg-panel shadow-card">
      <div className="relative h-64">
        <Image src={member.photo} alt={member.name} fill className="object-cover grayscale" />
      </div>

      <div className="space-y-5 p-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-bold text-text">{member.name}</h3>
              <p className="mt-1 text-sm text-gold">
                {member.role}{member.company ? ` · ${member.company}` : ""}
              </p>
            </div>
            {member.twitterUrl ? (
              <Link href={member.twitterUrl} className="text-sm text-muted hover:text-text">
                X
              </Link>
            ) : null}
          </div>

          {member.bio ? <p className="mt-4 text-sm leading-6 text-muted">{member.bio}</p> : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {member.badge ? <Badge className="border-gold/20 text-gold">{member.badge}</Badge> : null}
          {member.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
