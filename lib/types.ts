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
