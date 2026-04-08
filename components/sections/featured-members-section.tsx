"use client";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MemberCard } from "@/components/members/member-card";
import { Member } from "@/lib/types";
import { motion } from "framer-motion";

export function FeaturedMembersSection({ members }: { members: Member[] }) {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          title="Featured Contributors"
          subtitle="The pioneers leading the charge for Solana in the southern hemisphere."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {members.filter((m) => m.featured).map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <MemberCard member={member} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
