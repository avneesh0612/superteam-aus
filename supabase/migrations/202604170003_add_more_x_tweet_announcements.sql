-- Add additional X/Twitter links for Builder Voices in CMS announcements.

insert into public.cms_announcements (id, title, summary, href, tag, date, sort_order)
values
  (
    'tweet-superteamau-2039270701329506500',
    'SuperteamAU community update',
    'Official update from SuperteamAU shared on X.',
    'https://x.com/SuperteamAU/status/2039270701329506500',
    'Update',
    'Apr 2026',
    6
  ),
  (
    'tweet-superteamau-2039498760578060482',
    'SuperteamAU builder spotlight',
    'Another official SuperteamAU post added to Builder Voices.',
    'https://x.com/SuperteamAU/status/2039498760578060482',
    'Community',
    'Apr 2026',
    7
  )
on conflict (id) do update
set
  title = excluded.title,
  summary = excluded.summary,
  href = excluded.href,
  tag = excluded.tag,
  date = excluded.date,
  sort_order = excluded.sort_order;
