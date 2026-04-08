# Supabase CMS Operations

This guide documents how CMS auth, content editing, and database policies are set up.

## Environment

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE`

Admin access:

- Preferred: set admin claims/roles in Supabase Auth user metadata:
  - `cms_admin: true`, or
  - `role: "cms_admin"`, or
  - `roles: ["cms_admin"]`
- Fallback: allowlisted emails via `CMS_ADMIN_EMAILS`

Auth redirect support:

- `NEXT_PUBLIC_SITE_URL` used for magic-link and recovery callbacks.

## Auth flow

- `/cms`: auth UI with password, magic link, and reset.
- `/auth/callback`: client callback that exchanges code/OTP in browser context.
- `/cms/update-password`: updates password using active recovery session.

Note: Magic-link and reset actions are intentionally executed in browser context to avoid PKCE verifier mismatch issues.

## Database

CMS content table: `public.cms_content`

- `key` text primary key
- `value` jsonb
- `created_at`, `updated_at`

RLS:

- Read: allowed for `anon` and `authenticated`
- Write: blocked via policy removal; CMS writes use service-role server client

## Production checklist

1. Configure auth redirect URLs in Supabase:
   - `https://<your-domain>/auth/callback`
   - `http://localhost:3000/auth/callback` for local dev
2. Create CMS admin users and assign `cms_admin` role/claim.
3. Keep `SUPABASE_SERVICE_ROLE` server-only (never expose to client).
4. Rotate `CMS_ADMIN_EMAILS` fallback list when team access changes.
