import { Announcement, EventItem, FAQ, Member, MissionCard, Partner, Stat, Testimonial } from "@/lib/types";

export const navLinks = [
  { label: "Landing", href: "/" },
  { label: "Members", href: "/members" },
];

export const stats: Stat[] = [
  { id: "1", label: "Members", value: "150+" },
  { id: "2", label: "Events Hosted", value: "24" },
  { id: "3", label: "Projects Built", value: "45" },
  { id: "4", label: "Bounties", value: "$250k+" },
  { id: "5", label: "Reach", value: "10k+" },
];

export const missionCards: MissionCard[] = [
  {
    id: "1",
    title: "Builder & Founder Support",
    description: "Hands-on product and technical guidance to help teams ship across hackathons, bounties, and ecosystem programs.",
  },
  {
    id: "2",
    title: "Capital & Fundraising",
    description: "Connecting capital with investable, scalable projects while helping founders improve positioning and investor readiness.",
  },
  {
    id: "3",
    title: "Growth & Distribution",
    description: "Go-to-market support, ecosystem distribution, and community amplification for Australian builders on Solana.",
  },
  {
    id: "4",
    title: "Talent & Hiring",
    description: "Connecting teams with developers, designers, operators, and contributors across the ecosystem.",
  },
  {
    id: "5",
    title: "Institutional Engagement",
    description: "Bridging builders with institutions, policymakers, and real-world deployment opportunities.",
  },
  {
    id: "6",
    title: "Ecosystem & Community",
    description: "Events, education, collaboration, and showcasing Australian projects on the global stage.",
  },
];

export const events: EventItem[] = [
  {
    id: "1",
    title: "Solana Builder Brunch",
    city: "Sydney",
    date: "Jun 18, 2026",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    lumaUrl: "https://lu.ma",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Rust Workshop: Anchor Pro",
    city: "Melbourne",
    date: "Jul 02, 2026",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    lumaUrl: "https://lu.ma",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Web3 Founders Night",
    city: "Gold Coast",
    date: "Mar 11, 2026",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    lumaUrl: "https://lu.ma",
    status: "past",
  },
];

export const members: Member[] = [
  {
    id: "1",
    name: "Lachlan M.",
    role: "Rust Developer",
    company: "Independent",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    twitterUrl: "https://x.com",
    tags: ["Rust", "Solana"],
    badge: "Builder",
    featured: true,
    bio: "Shipping Solana-native products with a strong focus on protocols and developer tooling."
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Creative Director",
    company: "Studio AU",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    twitterUrl: "https://x.com",
    tags: ["Design", "UX"],
    badge: "Core Contributor",
    featured: true,
    bio: "Designing premium interfaces and brand systems for builders across the Australian ecosystem."
  },
  {
    id: "3",
    name: "James T.",
    role: "DeFi Strategist",
    company: "Reef Finance",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    twitterUrl: "https://x.com",
    tags: ["Trading", "Solana"],
    badge: "Founder",
    featured: true,
    bio: "Working at the intersection of internet capital markets, growth, and ecosystem strategy."
  },
  {
    id: "4",
    name: "Aria Wilde",
    role: "Ecosystem Lead",
    company: "Superteam AU",
    photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
    twitterUrl: "https://x.com",
    tags: ["Governance", "Community"],
    badge: "Core Team",
    featured: true,
    bio: "Connecting teams, contributors, and institutions exploring blockchain infrastructure in Australia."
  },
  {
    id: "5",
    name: "Michelle R.",
    role: "Product Designer",
    company: "Jupiter",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80",
    twitterUrl: "https://x.com",
    tags: ["Design", "Product"],
    badge: "Featured",
    bio: "Building elegant user flows for crypto products with a focus on usability and trust."
  },
  {
    id: "6",
    name: "Sam W.",
    role: "Frontend Engineer",
    company: "Independent",
    photo: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80",
    twitterUrl: "https://x.com",
    tags: ["Frontend", "React"],
    badge: "Builder",
    bio: "Creating fast interfaces and component systems for Web3 teams."
  },
];

export const partners: Partner[] = [
  { id: "1", name: "SOLANA", logoUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=400&q=80", websiteUrl: "https://solana.com", project: "Core ecosystem chain" },
  { id: "2", name: "JUPITER", logoUrl: "https://images.unsplash.com/photo-1621768216002-5ac171876625?auto=format&fit=crop&w=400&q=80", websiteUrl: "https://jup.ag", project: "DEX aggregation" },
  { id: "3", name: "HELIUM", logoUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=400&q=80", websiteUrl: "https://www.helium.com", project: "DePIN network" },
  { id: "4", name: "PYTH", logoUrl: "https://images.unsplash.com/photo-1642052502485-f8f6ad5ed7e0?auto=format&fit=crop&w=400&q=80", websiteUrl: "https://pyth.network", project: "Oracle infra" },
  { id: "5", name: "HIVE", logoUrl: "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=400&q=80", websiteUrl: "https://superteam.fun", project: "Community ops" },
];

export const announcements: Announcement[] = [
  {
    id: "1",
    title: "Superteam AU Sprint Week Announced",
    summary: "A week-long online build sprint focused on AI x Solana tools with mentor office hours.",
    href: "https://x.com/SuperteamAU",
    tag: "Programs",
    date: "May 2026",
  },
  {
    id: "2",
    title: "Builder Grants Open for Q3",
    summary: "Funding applications are now open for infrastructure, consumer apps, and education initiatives.",
    href: "https://x.com/SuperteamAU",
    tag: "Grants",
    date: "Apr 2026",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "Superteam Australia provided the bridge I needed to move from web2 development into Solana. The mentorship has been genuinely world-class.",
    name: "Dave K.",
    title: "Founder, Nexus Protocol",
  },
  {
    id: "2",
    quote: "The community vibe is unmatched. From Sydney meetups to global hackathons, you never feel like you are building alone.",
    name: "Michelle R.",
    title: "Lead Designer, Solana AU",
  },
  {
    id: "3",
    quote: "Winning our first bounty through Superteam was the validation we needed to go full-time. The ecosystem support is real.",
    name: "Sam W.",
    title: "Core Dev, Reef Finance",
  },
];

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "What is Superteam Australia?",
    answer: "Superteam Australia is a community-led organization accelerating founders, builders, creatives, and institutions across Australia that are exploring and building on Solana."
  },
  {
    id: "2",
    question: "How do I get involved?",
    answer: "Start by joining the community, exploring opportunities, attending events, and connecting with builders across Australia."
  },
  {
    id: "3",
    question: "What opportunities are available?",
    answer: "Members can access bounties, grants, events, mentorship, contributors, hiring opportunities, and ecosystem connections."
  },
];
