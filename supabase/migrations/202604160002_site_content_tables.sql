-- Site-wide copy, CTAs, footer, and get-involved form config (editable in Supabase + CMS).

-- ---------------------------------------------------------------------------
-- Singletons
-- ---------------------------------------------------------------------------

create table public.cms_hero (
  id smallint primary key default 1 check (id = 1),
  badge text not null,
  headline_l1_prefix text not null,
  headline_l1_highlight text not null,
  headline_l2_highlight text not null,
  headline_l2_suffix text not null,
  subtext text not null,
  primary_button_label text not null,
  primary_href text not null,
  secondary_button_label text not null,
  secondary_href text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_cta (
  id smallint primary key default 1 check (id = 1),
  title_line1 text not null,
  title_line2 text not null,
  description text not null,
  telegram_url text not null,
  discord_url text not null,
  twitter_url text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_footer_meta (
  id smallint primary key default 1 check (id = 1),
  brand_name text not null,
  tagline_default text not null,
  tagline_get_involved text not null,
  copyright_year text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_get_involved_page (
  id smallint primary key default 1 check (id = 1),
  join_badge text not null default 'Join the Elite',
  join_title_prefix text not null default 'The Southern ',
  join_title_gradient text not null default 'Frontier',
  page_subtitle text not null,
  perk_title text not null,
  perk_body text not null,
  privacy_note text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- ---------------------------------------------------------------------------
-- Lists
-- ---------------------------------------------------------------------------

create table public.cms_footer_links (
  id text primary key,
  label text not null,
  href text not null,
  sort_order int not null default 0,
  variant text not null check (variant in ('default', 'get_involved')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_interest_cards (
  id text primary key,
  title text not null,
  description text not null,
  icon_key text not null check (icon_key in ('bounties', 'grants', 'networking', 'jobs')),
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_select_options (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('primary_role', 'au_state')),
  value text not null,
  label text not null,
  sort_order int not null default 0,
  unique (category, value)
);

-- ---------------------------------------------------------------------------
-- Triggers (reuse set_updated_at from earlier migrations)
-- ---------------------------------------------------------------------------

drop trigger if exists cms_hero_set_updated_at on public.cms_hero;
create trigger cms_hero_set_updated_at
before update on public.cms_hero
for each row execute function public.set_updated_at();

drop trigger if exists cms_cta_set_updated_at on public.cms_cta;
create trigger cms_cta_set_updated_at
before update on public.cms_cta
for each row execute function public.set_updated_at();

drop trigger if exists cms_footer_meta_set_updated_at on public.cms_footer_meta;
create trigger cms_footer_meta_set_updated_at
before update on public.cms_footer_meta
for each row execute function public.set_updated_at();

drop trigger if exists cms_get_involved_page_set_updated_at on public.cms_get_involved_page;
create trigger cms_get_involved_page_set_updated_at
before update on public.cms_get_involved_page
for each row execute function public.set_updated_at();

drop trigger if exists cms_footer_links_set_updated_at on public.cms_footer_links;
create trigger cms_footer_links_set_updated_at
before update on public.cms_footer_links
for each row execute function public.set_updated_at();

drop trigger if exists cms_interest_cards_set_updated_at on public.cms_interest_cards;
create trigger cms_interest_cards_set_updated_at
before update on public.cms_interest_cards
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.cms_hero enable row level security;
alter table public.cms_cta enable row level security;
alter table public.cms_footer_meta enable row level security;
alter table public.cms_get_involved_page enable row level security;
alter table public.cms_footer_links enable row level security;
alter table public.cms_interest_cards enable row level security;
alter table public.cms_select_options enable row level security;

create policy "Public can read cms_hero" on public.cms_hero for select to anon, authenticated using (true);
create policy "Public can read cms_cta" on public.cms_cta for select to anon, authenticated using (true);
create policy "Public can read cms_footer_meta" on public.cms_footer_meta for select to anon, authenticated using (true);
create policy "Public can read cms_get_involved_page" on public.cms_get_involved_page for select to anon, authenticated using (true);
create policy "Public can read cms_footer_links" on public.cms_footer_links for select to anon, authenticated using (true);
create policy "Public can read cms_interest_cards" on public.cms_interest_cards for select to anon, authenticated using (true);
create policy "Public can read cms_select_options" on public.cms_select_options for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- Seed defaults (matches prior hardcoded marketing copy)
-- ---------------------------------------------------------------------------

insert into public.cms_hero (
  id, badge, headline_l1_prefix, headline_l1_highlight, headline_l2_highlight, headline_l2_suffix,
  subtext, primary_button_label, primary_href, secondary_button_label, secondary_href
) values (
  1,
  'The Southern Light',
  'The Home of ',
  'Solana',
  'Builders',
  ' in Australia.',
  'Accelerating founders, builders, creatives, and institutions exploring internet capital markets on Solana.',
  'Get Involved',
  '/get-involved',
  'Explore Opportunities',
  '/members'
);

insert into public.cms_cta (
  id, title_line1, title_line2, description, telegram_url, discord_url, twitter_url
) values (
  1,
  'Ready to Build',
  'the Frontier?',
  'Join the strongest Solana community in the APAC region.',
  'https://t.me',
  'https://discord.com',
  'https://x.com/SuperteamAU'
);

insert into public.cms_footer_meta (
  id, brand_name, tagline_default, tagline_get_involved, copyright_year
) values (
  1,
  'Superteam Australia',
  'The home of builders in Australia.',
  'Built for the high-end digital frontier.',
  '2026'
);

insert into public.cms_get_involved_page (
  id, join_badge, join_title_prefix, join_title_gradient, page_subtitle, perk_title, perk_body, privacy_note
) values (
  1,
  'Join the Elite',
  'The Southern ',
  'Frontier',
  'Australia''s premier Solana community. Connect with builders, designers, and founders across the continent.',
  'Member Perk',
  'Applicants from Australia gain priority access to exclusive ST Australia bounties and coworking retreats.',
  'Your data is stored securely and only visible to core contributors.'
);

insert into public.cms_footer_links (id, label, href, sort_order, variant) values
  ('d1', 'Landing', '/', 0, 'default'),
  ('d2', 'Members', '/members', 1, 'default'),
  ('d3', 'Get Involved', '/get-involved', 2, 'default'),
  ('d4', 'Global Superteam', 'https://superteam.fun', 3, 'default'),
  ('d5', 'Twitter', 'https://x.com/SuperteamAU', 4, 'default'),
  ('g1', 'Twitter', 'https://x.com/SuperteamAU', 0, 'get_involved'),
  ('g2', 'Discord', 'https://discord.com', 1, 'get_involved'),
  ('g3', 'Telegram', 'https://t.me', 2, 'get_involved'),
  ('g4', 'Superteam Global', 'https://superteam.fun', 3, 'get_involved'),
  ('g5', 'Privacy Policy', '/privacy', 4, 'get_involved');

insert into public.cms_interest_cards (id, title, description, icon_key, sort_order) values
  ('Bounties', 'Bounties', 'Earn USDC by completing ecosystem tasks.', 'bounties', 0),
  ('Grants', 'Grants', 'Seed funding for your next big project.', 'grants', 1),
  ('Networking', 'Networking', 'Connect with the top 1% of AU talent.', 'networking', 2),
  ('Jobs', 'Jobs', 'Full-time roles within the ecosystem.', 'jobs', 3);

insert into public.cms_select_options (category, value, label, sort_order) values
  ('primary_role', 'Builder', 'Builder', 0),
  ('primary_role', 'Designer', 'Designer', 1),
  ('primary_role', 'Founder', 'Founder', 2),
  ('primary_role', 'Content Creator', 'Content Creator', 3),
  ('primary_role', 'Community Lead', 'Community Lead', 4),
  ('au_state', 'NSW', 'NSW', 0),
  ('au_state', 'VIC', 'VIC', 1),
  ('au_state', 'QLD', 'QLD', 2),
  ('au_state', 'SA', 'SA', 3),
  ('au_state', 'WA', 'WA', 4),
  ('au_state', 'TAS', 'TAS', 5),
  ('au_state', 'NT', 'NT', 6),
  ('au_state', 'ACT', 'ACT', 7);
