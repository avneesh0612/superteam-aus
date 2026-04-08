create table if not exists public.cms_content (
  key text primary key check (key in ('navLinks', 'stats', 'missionCards', 'events', 'members', 'partners', 'testimonials', 'faqs')),
  value jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists cms_content_set_updated_at on public.cms_content;
create trigger cms_content_set_updated_at
before update on public.cms_content
for each row
execute function public.set_updated_at();

alter table public.cms_content enable row level security;

drop policy if exists "Public can read cms content" on public.cms_content;
create policy "Public can read cms content"
on public.cms_content
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can modify cms content" on public.cms_content;
create policy "Authenticated can modify cms content"
on public.cms_content
for all
to authenticated
using (true)
with check (true);
