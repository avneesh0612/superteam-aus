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
import { getSiteContent } from "@/lib/site-cms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Superteam Australia",
  description: "Explore Superteam Australia's community, events, ecosystem partners, and opportunities.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Superteam Australia",
    description: "Explore Superteam Australia's community, events, ecosystem partners, and opportunities.",
    url: "/",
    images: ["/logo-mark.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Superteam Australia",
    description: "Explore Superteam Australia's community, events, ecosystem partners, and opportunities.",
    images: ["/logo-mark.svg"],
  },
};

export default async function HomePage() {
  const [content, site] = await Promise.all([getCmsContent(), getSiteContent()]);

  return (
    <main className="min-h-screen bg-bg text-text">
      <Navbar navLinks={content.navLinks} activeHref="/" />
      <HeroSection hero={site.hero} />
      <StatsSection stats={content.stats} />
      <MissionSection missionCards={content.missionCards} />
      <EventsSection events={content.events} />
      <FeaturedMembersSection members={content.members} />
      <PartnersSection partners={content.partners} />
      <TestimonialsSection announcements={content.announcements} />
      <FAQSection faqs={content.faqs} />
      <CTASection cta={site.cta} />
      <Footer meta={site.footerMeta} links={site.footerLinks} />
    </main>
  );
}
