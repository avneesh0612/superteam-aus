# Superteam Australia Site

Next.js 14 site with a Supabase-backed CMS.

## Stack

- **Framework**: Next.js 14 (App Router)
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

### Dummy content / seeding

The project ships with seeded dummy content already applied in your Supabase project.
If you need to re-seed, you can insert/upsert rows into `public.cms_content` for keys:

`navLinks`, `stats`, `missionCards`, `events`, `members`, `partners`, `testimonials`, `faqs`.

## Design system rules

See `docs/` for project documentation:

- `docs/supabase-cms.md`
- `docs/design-system-rules.md`
- `docs/challenge-brief.md`
