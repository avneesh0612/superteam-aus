import { createServerClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export type CmsAdminRole = "super_admin" | "content_admin" | "applications_admin" | "viewer";
export type CmsPermission = "manage_admins" | "manage_content" | "manage_applications" | "view_dashboard";

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

function getNormalizedRoles(user: User): string[] {
  const appMeta = user.app_metadata || {};
  const userMeta = user.user_metadata || {};
  const rawRoles = appMeta.roles || userMeta.roles;
  const roles = Array.isArray(rawRoles) ? rawRoles : [];

  const roleValue = [appMeta.role, userMeta.role]
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().toLowerCase());

  return [
    ...roleValue,
    ...roles
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim().toLowerCase()),
  ];
}

function hasAdminClaim(user: User) {
  const appMeta = user.app_metadata || {};
  const userMeta = user.user_metadata || {};
  if (appMeta.cms_admin === true || userMeta.cms_admin === true) return true;

  const roles = getNormalizedRoles(user);
  return roles.some((role) =>
    ["cms_admin", "super_admin", "content_admin", "applications_admin", "viewer"].includes(role)
  );
}

export function isCmsAuthorizedUser(user: User | null) {
  if (!user) return false;
  if (hasAdminClaim(user)) return true;

  const email = user.email?.toLowerCase() || "";
  const allowlistedEmails = getCmsAdminEmails();
  return Boolean(email) && allowlistedEmails.includes(email);
}

export function getCmsAdminRole(user: User | null): CmsAdminRole | "none" {
  if (!user) return "none";
  const roles = getNormalizedRoles(user);
  if (roles.includes("super_admin") || roles.includes("cms_admin")) return "super_admin";
  if (roles.includes("content_admin")) return "content_admin";
  if (roles.includes("applications_admin")) return "applications_admin";
  if (roles.includes("viewer")) return "viewer";

  const email = user.email?.toLowerCase() || "";
  if (email && getCmsAdminEmails().includes(email)) return "super_admin";
  return "none";
}

export function hasCmsPermission(user: User | null, permission: CmsPermission) {
  const role = getCmsAdminRole(user);
  if (role === "none") return false;
  if (role === "super_admin") return true;
  if (permission === "view_dashboard") return true;
  if (permission === "manage_content") return role === "content_admin";
  if (permission === "manage_applications") return role === "applications_admin";
  if (permission === "manage_admins") return false;
  return false;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
