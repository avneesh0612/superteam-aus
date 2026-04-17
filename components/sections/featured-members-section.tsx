"use client";

import { Container } from "@/components/ui/container";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { MemberCard } from "@/components/members/member-card";
import { Member } from "@/lib/types";

export function FeaturedMembersSection({ members }: { members: Member[] }) {
  return (
    <section className="py-24">
      <Container>
        <Reveal>
          <SectionHeading
            title="Featured Contributors"
            subtitle="The pioneers leading the charge for Solana in the southern hemisphere."
          />
        </Reveal>

        <StaggerGroup className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {members.filter((m) => m.featured).map((member, index) => (
            <StaggerItem key={member.id} whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
              <MemberCard member={member} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
