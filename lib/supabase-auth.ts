import { createServerClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
}

export async function createServerSupabaseAuthClient() {
  const cookieStore = await cookies();
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL/anon key are required for auth.");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components can read cookies but may not always be able to write them.
        }
      },
    },
  });
}

export function getCmsAdminEmails() {
  const raw = process.env.CMS_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function hasAdminClaim(user: User) {
  const appMeta = user.app_metadata || {};
  const userMeta = user.user_metadata || {};

  if (appMeta.cms_admin === true || userMeta.cms_admin === true) return true;
  if (appMeta.role === "cms_admin" || userMeta.role === "cms_admin") return true;

  const roles = appMeta.roles || userMeta.roles;
  if (Array.isArray(roles) && roles.includes("cms_admin")) return true;

  return false;
}

export function isCmsAuthorizedUser(user: User | null) {
  if (!user) return false;
  if (hasAdminClaim(user)) return true;

  const email = user.email?.toLowerCase() || "";
  const allowlistedEmails = getCmsAdminEmails();
  return Boolean(email) && allowlistedEmails.includes(email);
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
