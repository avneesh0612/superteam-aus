import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { MembersGrid } from "@/components/members/members-grid";
import { MembersHero } from "@/components/members/members-hero";
import { Container } from "@/components/ui/container";
import { getCmsContent } from "@/lib/cms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members",
  description: "Browse Superteam Australia members by skills, roles, and ecosystem focus.",
};

export default async function MembersPage() {
  const content = await getCmsContent();

  return (
    <main className="min-h-screen bg-bg text-text">
      <Navbar navLinks={content.navLinks} />
      <MembersHero />
      <section className="pb-24">
        <Container>
          <MembersGrid members={content.members} />
        </Container>
      </section>
      <Footer />
    </main>
  );
}
