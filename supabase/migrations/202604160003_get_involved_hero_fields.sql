alter table public.cms_get_involved_page
  add column if not exists join_badge text,
  add column if not exists join_title_prefix text,
  add column if not exists join_title_gradient text;

update public.cms_get_involved_page
set
  join_badge = coalesce(join_badge, 'Join the Elite'),
  join_title_prefix = coalesce(join_title_prefix, 'The Southern '),
  join_title_gradient = coalesce(join_title_gradient, 'Frontier')
where id = 1;

alter table public.cms_get_involved_page
  alter column join_badge set not null,
  alter column join_title_prefix set not null,
  alter column join_title_gradient set not null;
