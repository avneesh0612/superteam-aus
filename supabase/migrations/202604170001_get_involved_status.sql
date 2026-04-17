alter table public.get_involved_submissions
  add column if not exists status text not null default 'new';

alter table public.get_involved_submissions
  drop constraint if exists get_involved_submissions_status_check;

alter table public.get_involved_submissions
  add constraint get_involved_submissions_status_check
  check (status in ('new', 'reviewing', 'shortlisted', 'accepted', 'rejected'));
