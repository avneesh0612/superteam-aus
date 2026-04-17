import { createServiceSupabaseClient } from "@/lib/supabase";
import type { CmsAdminRole } from "@/lib/supabase-auth";

export type CmsAdminUser = {
  id: string;
  email: string;
  source: "claim" | "allowlist";
  role: CmsAdminRole;
  createdAt?: string;
  lastSignInAt?: string;
};

function getRoleFromUser(user: {
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}): CmsAdminRole | null {
  const appMeta = user.app_metadata || {};
  const userMeta = user.user_metadata || {};
  const roles = [appMeta.role, userMeta.role]
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.toLowerCase());
  const roleList = (appMeta.roles || userMeta.roles) as unknown;
  const multiRoles = Array.isArray(roleList)
    ? roleList.filter((value): value is string => typeof value === "string").map((value) => value.toLowerCase())
    : [];

  const all = [...roles, ...multiRoles];
  if (appMeta.cms_admin === true || userMeta.cms_admin === true || all.includes("cms_admin") || all.includes("super_admin")) {
    return "super_admin";
  }
  if (all.includes("content_admin")) return "content_admin";
  if (all.includes("applications_admin")) return "applications_admin";
  if (all.includes("viewer")) return "viewer";

  return null;
}

export async function listCmsAdminUsers(allowlistedEmails: string[]): Promise<CmsAdminUser[]> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return [];

  const result: CmsAdminUser[] = [];
  const seen = new Set<string>();
  let page = 1;
  const perPage = 200;

  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error || !data?.users?.length) break;

    for (const user of data.users) {
      const email = user.email?.toLowerCase() || "";
      if (!email) continue;
      const roleFromClaim = getRoleFromUser(user);
      const viaClaim = Boolean(roleFromClaim);
      const viaAllowlist = allowlistedEmails.includes(email);
      if (!viaClaim && !viaAllowlist) continue;
      if (seen.has(user.id)) continue;
      seen.add(user.id);

      result.push({
        id: user.id,
        email,
        source: viaClaim ? "claim" : "allowlist",
        role: roleFromClaim || "super_admin",
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at ?? undefined,
      });
    }

    if (data.users.length < perPage) break;
    page += 1;
  }

  return result.sort((a, b) => a.email.localeCompare(b.email));
}
