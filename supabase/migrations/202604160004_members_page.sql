create table public.cms_members_page (
  id smallint primary key default 1 check (id = 1),
  title_before text not null default 'Meet the ',
  title_highlight text not null default 'Builders',
  subtitle text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists cms_members_page_set_updated_at on public.cms_members_page;
create trigger cms_members_page_set_updated_at
before update on public.cms_members_page
for each row execute function public.set_updated_at();

alter table public.cms_members_page enable row level security;

create policy "Public can read cms_members_page"
on public.cms_members_page for select to anon, authenticated using (true);

insert into public.cms_members_page (id, title_before, title_highlight, subtitle) values (
  1,
  'Meet the ',
  'Builders',
  'A simple first-pass members showcase for the Superteam Australia ecosystem.'
);
