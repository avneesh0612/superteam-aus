-- Normalized CMS tables (editable per-row in Supabase) replacing cms_content JSON blobs.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.cms_nav_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_stats (
  id text primary key,
  label text not null,
  value text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_mission_cards (
  id text primary key,
  title text not null,
  description text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_events (
  id text primary key,
  title text not null,
  city text not null,
  date text not null,
  image text not null,
  luma_url text not null,
  status text check (status is null or status in ('upcoming', 'past')),
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_members (
  id text primary key,
  name text not null,
  role text not null,
  company text,
  location text,
  photo text not null,
  twitter_url text,
  tags text[] not null default '{}',
  badge text,
  featured boolean not null default false,
  bio text,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_partners (
  id text primary key,
  name text not null,
  logo_url text,
  website_url text,
  project text,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_announcements (
  id text primary key,
  title text not null,
  summary text not null,
  href text,
  tag text,
  date text,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_testimonials (
  id text primary key,
  quote text not null,
  name text not null,
  title text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_faqs (
  id text primary key,
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

drop trigger if exists cms_nav_links_set_updated_at on public.cms_nav_links;
create trigger cms_nav_links_set_updated_at
before update on public.cms_nav_links
for each row execute function public.set_updated_at();

drop trigger if exists cms_stats_set_updated_at on public.cms_stats;
create trigger cms_stats_set_updated_at
before update on public.cms_stats
for each row execute function public.set_updated_at();

drop trigger if exists cms_mission_cards_set_updated_at on public.cms_mission_cards;
create trigger cms_mission_cards_set_updated_at
before update on public.cms_mission_cards
for each row execute function public.set_updated_at();

drop trigger if exists cms_events_set_updated_at on public.cms_events;
create trigger cms_events_set_updated_at
before update on public.cms_events
for each row execute function public.set_updated_at();

drop trigger if exists cms_members_set_updated_at on public.cms_members;
create trigger cms_members_set_updated_at
before update on public.cms_members
for each row execute function public.set_updated_at();

drop trigger if exists cms_partners_set_updated_at on public.cms_partners;
create trigger cms_partners_set_updated_at
before update on public.cms_partners
for each row execute function public.set_updated_at();

drop trigger if exists cms_announcements_set_updated_at on public.cms_announcements;
create trigger cms_announcements_set_updated_at
before update on public.cms_announcements
for each row execute function public.set_updated_at();

drop trigger if exists cms_testimonials_set_updated_at on public.cms_testimonials;
create trigger cms_testimonials_set_updated_at
before update on public.cms_testimonials
for each row execute function public.set_updated_at();

drop trigger if exists cms_faqs_set_updated_at on public.cms_faqs;
create trigger cms_faqs_set_updated_at
before update on public.cms_faqs
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: public read; writes via service role only (same as prior cms_content)
-- ---------------------------------------------------------------------------

alter table public.cms_nav_links enable row level security;
alter table public.cms_stats enable row level security;
alter table public.cms_mission_cards enable row level security;
alter table public.cms_events enable row level security;
alter table public.cms_members enable row level security;
alter table public.cms_partners enable row level security;
alter table public.cms_announcements enable row level security;
alter table public.cms_testimonials enable row level security;
alter table public.cms_faqs enable row level security;

create policy "Public can read cms_nav_links"
on public.cms_nav_links for select to anon, authenticated using (true);

create policy "Public can read cms_stats"
on public.cms_stats for select to anon, authenticated using (true);

create policy "Public can read cms_mission_cards"
on public.cms_mission_cards for select to anon, authenticated using (true);

create policy "Public can read cms_events"
on public.cms_events for select to anon, authenticated using (true);

create policy "Public can read cms_members"
on public.cms_members for select to anon, authenticated using (true);

create policy "Public can read cms_partners"
on public.cms_partners for select to anon, authenticated using (true);

create policy "Public can read cms_announcements"
on public.cms_announcements for select to anon, authenticated using (true);

create policy "Public can read cms_testimonials"
on public.cms_testimonials for select to anon, authenticated using (true);

create policy "Public can read cms_faqs"
on public.cms_faqs for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- Migrate existing cms_content JSON into normalized tables
-- ---------------------------------------------------------------------------

insert into public.cms_nav_links (label, href, sort_order)
select
  coalesce(elem->>'label', ''),
  coalesce(elem->>'href', ''),
  (ord - 1)::int
from public.cms_content c
cross join lateral jsonb_array_elements(c.value) with ordinality as t(elem, ord)
where c.key = 'navLinks';

insert into public.cms_stats (id, label, value, sort_order)
select
  coalesce(elem->>'id', ''),
  coalesce(elem->>'label', ''),
  coalesce(elem->>'value', ''),
  (ord - 1)::int
from public.cms_content c
cross join lateral jsonb_array_elements(c.value) with ordinality as t(elem, ord)
where c.key = 'stats';

insert into public.cms_mission_cards (id, title, description, sort_order)
select
  coalesce(elem->>'id', ''),
  coalesce(elem->>'title', ''),
  coalesce(elem->>'description', ''),
  (ord - 1)::int
from public.cms_content c
cross join lateral jsonb_array_elements(c.value) with ordinality as t(elem, ord)
where c.key = 'missionCards';

insert into public.cms_events (id, title, city, date, image, luma_url, status, sort_order)
select
  coalesce(elem->>'id', ''),
  coalesce(elem->>'title', ''),
  coalesce(elem->>'city', ''),
  coalesce(elem->>'date', ''),
  coalesce(elem->>'image', ''),
  coalesce(elem->>'lumaUrl', ''),
  case
    when elem->>'status' is null or elem->>'status' = '' then null
    when elem->>'status' in ('upcoming', 'past') then elem->>'status'
    else null
  end,
  (ord - 1)::int
from public.cms_content c
cross join lateral jsonb_array_elements(c.value) with ordinality as t(elem, ord)
where c.key = 'events';

insert into public.cms_members (
  id, name, role, company, location, photo, twitter_url, tags, badge, featured, bio, sort_order
)
select
  coalesce(elem->>'id', ''),
  coalesce(elem->>'name', ''),
  coalesce(elem->>'role', ''),
  nullif(elem->>'company', ''),
  nullif(elem->>'location', ''),
  coalesce(elem->>'photo', ''),
  nullif(elem->>'twitterUrl', ''),
  case
    when elem->'tags' is null then array[]::text[]
    else coalesce(array(select jsonb_array_elements_text(elem->'tags')), array[]::text[])
  end,
  nullif(elem->>'badge', ''),
  coalesce((elem->>'featured')::boolean, false),
  nullif(elem->>'bio', ''),
  (ord - 1)::int
from public.cms_content c
cross join lateral jsonb_array_elements(c.value) with ordinality as t(elem, ord)
where c.key = 'members';

insert into public.cms_partners (id, name, logo_url, website_url, project, sort_order)
select
  coalesce(elem->>'id', ''),
  coalesce(elem->>'name', ''),
  nullif(elem->>'logoUrl', ''),
  nullif(elem->>'websiteUrl', ''),
  nullif(elem->>'project', ''),
  (ord - 1)::int
from public.cms_content c
cross join lateral jsonb_array_elements(c.value) with ordinality as t(elem, ord)
where c.key = 'partners';

insert into public.cms_announcements (id, title, summary, href, tag, date, sort_order)
select
  coalesce(elem->>'id', ''),
  coalesce(elem->>'title', ''),
  coalesce(elem->>'summary', ''),
  nullif(elem->>'href', ''),
  nullif(elem->>'tag', ''),
  nullif(elem->>'date', ''),
  (ord - 1)::int
from public.cms_content c
cross join lateral jsonb_array_elements(c.value) with ordinality as t(elem, ord)
where c.key = 'announcements';

insert into public.cms_testimonials (id, quote, name, title, sort_order)
select
  coalesce(elem->>'id', ''),
  coalesce(elem->>'quote', ''),
  coalesce(elem->>'name', ''),
  coalesce(elem->>'title', ''),
  (ord - 1)::int
from public.cms_content c
cross join lateral jsonb_array_elements(c.value) with ordinality as t(elem, ord)
where c.key = 'testimonials';

insert into public.cms_faqs (id, question, answer, sort_order)
select
  coalesce(elem->>'id', ''),
  coalesce(elem->>'question', ''),
  coalesce(elem->>'answer', ''),
  (ord - 1)::int
from public.cms_content c
cross join lateral jsonb_array_elements(c.value) with ordinality as t(elem, ord)
where c.key = 'faqs';

-- Drop legacy key/value store
drop table if exists public.cms_content;
