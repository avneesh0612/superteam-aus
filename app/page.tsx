import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CTASection } from "@/components/sections/cta-section";
import { EventsSection } from "@/components/sections/events-section";
import { FAQSection } from "@/components/sections/faq-section";
import { FeaturedMembersSection } from "@/components/sections/featured-members-section";
import { HeroSection } from "@/components/sections/hero-section";
import { MissionSection } from "@/components/sections/mission-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { getCmsContent } from "@/lib/cms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Explore Superteam Australia's community, events, ecosystem partners, and opportunities.",
};

export default async function HomePage() {
  const content = await getCmsContent();

  return (
    <main className="min-h-screen bg-bg text-text">
      <Navbar navLinks={content.navLinks} />
      <HeroSection />
      <StatsSection stats={content.stats} />
      <MissionSection missionCards={content.missionCards} />
      <EventsSection events={content.events} />
      <FeaturedMembersSection members={content.members} />
      <PartnersSection partners={content.partners} />
      <TestimonialsSection testimonials={content.testimonials} announcements={content.announcements} />
      <FAQSection faqs={content.faqs} />
      <CTASection />
      <Footer />
    </main>
  );
}
