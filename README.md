# Superteam Australia Site

## Quick links

- [Demo](https://www.loom.com/share/80f1d37a4d9d4e67a125fcb8d1079c1e)
- [Website](https://superteam-aus-site.vercel.app/)
- [Design](https://www.figma.com/design/lzTS7HEaHP9RfNgUDJ1WO0/Superteam-Australia-%E2%80%94-Design?node-id=0-1&t=z4ZGTdVE4xuQmvUK-1)

Next.js 16 site with a Supabase-backed CMS.

## Website overview

This project powers the public Superteam Australia web presence and an internal CMS used to manage live content without code changes.

- **Public experience**:
  - ` / ` landing page for community positioning, stats, events, featured members, partners, testimonials, FAQ, and CTA
  - ` /members ` searchable member directory
  - ` /get-involved ` onboarding/application page
- **Content source**:
  - Most homepage + members content is loaded from Supabase-backed CMS tables
  - Site-level copy (hero, CTA, footer, form copy, members hero copy) is stored in dedicated site-content sections
- **Rendering model**:
  - App Router server components fetch content on request/build
  - Client components are used for interactive UI (filters, animations, forms)

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI primitives**: shadcn-style components built on Radix UI
- **Package manager**: Bun
- **CMS/DB**: Supabase (Postgres + RLS)
- **Motion**: Framer Motion

## Pages

- **`/`**: Landing
- **`/members`**: Members directory
- **`/get-involved`**: Community onboarding form
- **`/cms`**: Admin CMS UI (Supabase Auth)
- **`/auth/callback`**: Supabase auth callback endpoint (magic link + password reset)

## Run locally

```bash
bun install
bun run dev
```

## Production scripts

```bash
bun run build
bun run start
```

## CMS

### Admin flow (auth + editing)

1. Admin opens ` /cms `.
2. If unauthenticated, they sign in via email/password or magic link.
3. Supabase redirects to ` /auth/callback ` after auth actions.
4. Callback exchanges session and routes the user back to CMS/password flow.
5. CMS verifies authorization:
   - `cms_admin` metadata/claims/roles, or
   - allowlisted email from `CMS_ADMIN_EMAILS`.
6. Authorized users can edit JSON-backed content sections in CMS UI.
7. Save actions run as secure server actions using the service role key.
8. Site paths are revalidated so updates appear immediately on public pages.

### Environment variables

Copy `.env.example` to `.env` and fill it in.

- **Required (public read)**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Required (server-only writes)**:
  - `SUPABASE_SERVICE_ROLE`
- **Required (CMS UI access)**:
  - `CMS_ADMIN_EMAILS` (comma-separated admin allowlist)
- **Optional (recommended)**:
  - `NEXT_PUBLIC_SITE_URL` (used in magic link and password reset redirects)
  - `CRON_SECRET` (required in production to secure Vercel cron endpoints)
  - `LUMA_API_KEY` (required for Luma event sync)

### Luma event sync cron

This project includes a Vercel cron job that pulls events from the Luma API and updates the CMS `events` section in Supabase.

- **Cron config**: `vercel.json` (`/api/cron/luma-events`, daily at 06:00 UTC)
- **Route**: `app/api/cron/luma-events/route.ts`
- **Auth**: endpoint validates `Authorization: Bearer <CRON_SECRET>`
- **Luma auth**: uses `x-luma-api-key: $LUMA_API_KEY`
- **API endpoint used**: `GET https://public-api.luma.com/v1/calendar/list-events`
- **Sync behavior**:
  - Luma-imported events are stored with ids prefixed by `luma-`
  - Existing manual CMS events (non-`luma-` ids) are preserved
  - Imported events are marked as `upcoming` or `past` based on start time

After setting env vars in Vercel, deploy and the cron will run automatically in production.
If you are on Vercel Hobby, keep it to a daily schedule (Hobby does not allow multiple cron runs per day).

### Security model

- **Public site** reads CMS content using the **anon key**.
- **CMS saves** run on the server using the **service role key** (never exposed to the browser).
- **CMS login** supports:
  - email/password
  - magic link
  - password reset
- Admin authorization is granted by either:
  - custom claim/metadata `cms_admin = true`, or role `cms_admin`, or roles includes `cms_admin`
  - fallback email allowlist in `CMS_ADMIN_EMAILS`
- The `cms_content` table is **readable by anon/authenticated**, but **not writable** via RLS policies.

### Supabase Auth setup checklist

- In Supabase Dashboard, enable the auth providers you want (email/password at minimum).
- Add your local and production URLs to Auth redirect settings.
- Create at least one admin user in Supabase Auth.
- Grant admin access via one of:
  - add `cms_admin` claim/metadata/role
  - include user email in `CMS_ADMIN_EMAILS`

### Database schema

CMS content is stored in a single table:

- `public.cms_content`
  - `key` (primary key; one row per section)
  - `value` (`jsonb`; section payload)
  - `created_at`, `updated_at`

Migrations are tracked in `supabase/migrations/`.

Get involved submissions are stored in:

- `public.get_involved_submissions`

Site copy/settings are also normalized into dedicated site-content tables (see migrations and `lib/site-cms.ts`).

### Dummy content / seeding

The project ships with seeded dummy content already applied in your Supabase project.
If you need to re-seed, you can insert/upsert rows into `public.cms_content` for keys:

`navLinks`, `stats`, `missionCards`, `events`, `members`, `partners`, `testimonials`, `faqs`.

## Design system rules

See `docs/` for project documentation:

- `docs/supabase-cms.md`
- `docs/design-system-rules.md`
- `docs/challenge-brief.md`

## Design file

- Figma: [Superteam Australia — Design](https://www.figma.com/design/lzTS7HEaHP9RfNgUDJ1WO0/Superteam-Australia-%E2%80%94-Design?node-id=0-1&t=z4ZGTdVE4xuQmvUK-1)
