export type Stat = {
  id: string;
  label: string;
  value: string;
};

export type MissionCard = {
  id: string;
  title: string;
  description: string;
};

export type EventItem = {
  id: string;
  title: string;
  city: string;
  date: string;
  image: string;
  lumaUrl: string;
  status?: "upcoming" | "past";
};

export type Member = {
  id: string;
  name: string;
  role: string;
  company?: string;
  location?: string;
  photo: string;
  twitterUrl?: string;
  tags: string[];
  badge?: string;
  featured?: boolean;
  bio?: string;
};

export type Partner = {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  project?: string;
};

export type Announcement = {
  id: string;
  title: string;
  summary: string;
  href?: string;
  tag?: string;
  date?: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  title: string;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export type NavLink = {
  label: string;
  href: string;
};

export type CMSContent = {
  navLinks: NavLink[];
  stats: Stat[];
  missionCards: MissionCard[];
  events: EventItem[];
  members: Member[];
  partners: Partner[];
  announcements: Announcement[];
  testimonials: Testimonial[];
  faqs: FAQ[];
};

export type CMSKey = keyof CMSContent;

export type InterestIconKey = "bounties" | "grants" | "networking" | "jobs";

export type HeroContent = {
  badge: string;
  headlineL1Prefix: string;
  headlineL1Highlight: string;
  headlineL2Highlight: string;
  headlineL2Suffix: string;
  subtext: string;
  primaryButtonLabel: string;
  primaryHref: string;
  secondaryButtonLabel: string;
  secondaryHref: string;
};

export type CtaContent = {
  titleLine1: string;
  titleLine2: string;
  description: string;
  telegramUrl: string;
  discordUrl: string;
  twitterUrl: string;
};

export type FooterMeta = {
  brandName: string;
  taglineDefault: string;
  taglineGetInvolved: string;
  copyrightYear: string;
};

export type FooterLink = {
  id: string;
  label: string;
  href: string;
  variant: "default" | "get_involved";
};

export type GetInvolvedPageCopy = {
  joinBadge: string;
  joinTitlePrefix: string;
  joinTitleGradient: string;
  pageSubtitle: string;
  perkTitle: string;
  perkBody: string;
  privacyNote: string;
};

export type InterestCardConfig = {
  id: string;
  title: string;
  description: string;
  iconKey: InterestIconKey;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type MembersPageCopy = {
  titleBefore: string;
  titleHighlight: string;
  subtitle: string;
};

export type SiteContent = {
  hero: HeroContent;
  cta: CtaContent;
  footerMeta: FooterMeta;
  footerLinks: FooterLink[];
  getInvolvedPage: GetInvolvedPageCopy;
  interestCards: InterestCardConfig[];
  primaryRoles: SelectOption[];
  auStates: SelectOption[];
  membersPage: MembersPageCopy;
};

export type SiteSectionKey = keyof SiteContent;
