-- Seed X/Twitter status links for the Builder Voices section (CMS announcements).
-- These are inserted/updated as top-priority announcement rows.

update public.cms_announcements
set sort_order = sort_order + 100
where id not in (
  'tweet-demether-2044734170862334112',
  'tweet-avneesh-2044457883430228444',
  'tweet-superteamearn-2044242311593504992',
  'tweet-swandogs-2044704519993667971',
  'tweet-linny-2043671462163427618',
  'tweet-superteamau-2042367661548671064'
)
and sort_order between 0 and 5;

insert into public.cms_announcements (id, title, summary, href, tag, date, sort_order)
values
  (
    'tweet-demether-2044734170862334112',
    'DemetherDeFi launch event recap',
    'Hosted by SuperteamAU — rooftop launch event in Sydney.',
    'https://x.com/DemetherDeFi/status/2044734170862334112',
    'Community',
    'Apr 2026',
    0
  ),
  (
    'tweet-avneesh-2044457883430228444',
    'SuperteamAU launch event view',
    'Views from today’s SuperteamAU event.',
    'https://x.com/avneesh0612/status/2044457883430228444',
    'Community',
    'Apr 2026',
    1
  ),
  (
    'tweet-superteamearn-2044242311593504992',
    'Website challenge spotlight',
    'Superteam Earn highlights the design/build challenge.',
    'https://x.com/SuperteamEarn/status/2044242311593504992',
    'Opportunity',
    'Apr 2026',
    2
  ),
  (
    'tweet-swandogs-2044704519993667971',
    'Builder launch night',
    'Night 2 of SuperteamAU launch in Sydney.',
    'https://x.com/swandogs/status/2044704519993667971',
    'Community',
    'Apr 2026',
    3
  ),
  (
    'tweet-linny-2043671462163427618',
    'Community participation',
    'Community member sharing challenge participation.',
    'https://x.com/0xLinnyx0/status/2043671462163427618',
    'Community',
    'Apr 2026',
    4
  ),
  (
    'tweet-superteamau-2042367661548671064',
    'Ecosystem partner momentum',
    'SuperteamAU update on ecosystem growth momentum.',
    'https://x.com/SuperteamAU/status/2042367661548671064',
    'Update',
    'Apr 2026',
    5
  )
on conflict (id) do update
set
  title = excluded.title,
  summary = excluded.summary,
  href = excluded.href,
  tag = excluded.tag,
  date = excluded.date,
  sort_order = excluded.sort_order;
