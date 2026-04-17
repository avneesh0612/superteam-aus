import { getCmsContent, upsertCmsContent } from "@/lib/cms";
import { InviteAdminForm } from "@/app/cms/invite-admin-form";
import { ApplicationStatusSubmitButton, LogoutSubmitButton } from "@/app/cms/form-submit-buttons";
import { SiteSettingsEditor } from "@/app/cms/site-settings-editor";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CMSEditor } from "@/app/cms/cms-editor";
import {
  createServerSupabaseAuthClient,
  getCmsAdminEmails,
  getCmsAdminRole,
  getSiteUrl,
  hasCmsPermission,
  isCmsAuthorizedUser,
  type CmsAdminRole,
} from "@/lib/supabase-auth";
import { CMSAuthAssist } from "@/app/cms/cms-auth-assist";
import { getSiteContent, upsertSiteSection } from "@/lib/site-cms";
import type { CMSKey, SiteSectionKey } from "@/lib/types";
import {
  listGetInvolvedSubmissions,
  supportsSubmissionStatusColumn,
  updateGetInvolvedSubmissionStatus,
} from "@/lib/get-involved-db";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { listCmsAdminUsers } from "@/lib/admin-users-db";
import { Metadata } from "next";

const APPLICATION_STATUS_ORDER = {
  new: 0,
  reviewing: 1,
  shortlisted: 2,
  accepted: 3,
  rejected: 4,
} as const;

function getStatusBadgeClass(status: string) {
  if (status === "new") return "border-sky-300/40 bg-sky-400/10 text-sky-200";
  if (status === "reviewing") return "border-amber-300/40 bg-amber-400/10 text-amber-200";
  if (status === "shortlisted") return "border-violet-300/40 bg-violet-400/10 text-violet-200";
  if (status === "accepted") return "border-green/40 bg-green/15 text-green";
  if (status === "rejected") return "border-red-300/40 bg-red-500/10 text-red-200";
  return "border-white/[0.1] bg-white/[0.03] text-muted";
}

export const metadata: Metadata = {
  title: "CMS",
  description: "Content management console for Superteam Australia.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CMSPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createServerSupabaseAuthClient();
  let userData: { user: Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"] } = { user: null };
  try {
    const { data } = await supabase.auth.getUser();
    userData = data;
  } catch {
    userData = { user: null };
  }
  const isAuthorized = isCmsAuthorizedUser(userData.user);
  const currentRole = getCmsAdminRole(userData.user);
  const canManageContent = hasCmsPermission(userData.user, "manage_content");
  const canManageApplications = hasCmsPermission(userData.user, "manage_applications");
  const canManageAdmins = hasCmsPermission(userData.user, "manage_admins");
  const [content, site, submissions, admins, hasSubmissionStatus] = await Promise.all([
    getCmsContent(),
    getSiteContent(),
    listGetInvolvedSubmissions(150),
    listCmsAdminUsers(getCmsAdminEmails()),
    supportsSubmissionStatusColumn(),
  ]);
  const sortedSubmissions = [...submissions].sort((a, b) => {
    const aStatus = a.status || "new";
    const bStatus = b.status || "new";
    const rankA = APPLICATION_STATUS_ORDER[aStatus as keyof typeof APPLICATION_STATUS_ORDER] ?? 99;
    const rankB = APPLICATION_STATUS_ORDER[bStatus as keyof typeof APPLICATION_STATUS_ORDER] ?? 99;
    if (rankA !== rankB) return rankA - rankB;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  const status = resolvedSearchParams?.status;
  const message = resolvedSearchParams?.message;

  async function logout() {
    "use server";
    const authClient = await createServerSupabaseAuthClient();
    await authClient.auth.signOut();
    redirect("/cms?status=ok&message=Logged%20out.");
  }

  async function saveSection(key: CMSKey, payload: string) {
    "use server";
    const authClient = await createServerSupabaseAuthClient();
    const { data: currentUser } = await authClient.auth.getUser();
    const validSession = isCmsAuthorizedUser(currentUser.user);
    const hasPermission = hasCmsPermission(currentUser.user, "manage_content");

    if (!validSession || !hasPermission) {
      redirect("/cms?status=error&message=Unauthorized.");
    }

    if (typeof key !== "string" || typeof payload !== "string") {
      throw new Error("Invalid save request.");
    }

    const parsed = JSON.parse(payload);
    await upsertCmsContent(key as CMSKey, parsed);
  }

  async function saveSiteSectionAction(key: SiteSectionKey, payload: string) {
    "use server";
    const authClient = await createServerSupabaseAuthClient();
    const { data: currentUser } = await authClient.auth.getUser();
    const validSession = isCmsAuthorizedUser(currentUser.user);
    const hasPermission = hasCmsPermission(currentUser.user, "manage_content");

    if (!validSession || !hasPermission) {
      redirect("/cms?status=error&message=Unauthorized.");
    }

    if (typeof key !== "string" || typeof payload !== "string") {
      throw new Error("Invalid save request.");
    }

    const parsed = JSON.parse(payload);
    await upsertSiteSection(key as SiteSectionKey, parsed);
  }

  async function updateApplicationStatus(formData: FormData) {
    "use server";
    const authClient = await createServerSupabaseAuthClient();
    const { data: currentUser } = await authClient.auth.getUser();
    const validSession = isCmsAuthorizedUser(currentUser.user);
    const hasPermission = hasCmsPermission(currentUser.user, "manage_applications");
    if (!validSession || !hasPermission) {
      redirect("/cms?status=error&message=Unauthorized.");
    }

    const idRaw = formData.get("id");
    const statusRaw = formData.get("status");
    const id = Number(idRaw);
    const status = String(statusRaw || "").trim();
    const allowedStatuses = ["new", "reviewing", "shortlisted", "accepted", "rejected"];

    if (!Number.isFinite(id) || id <= 0 || !allowedStatuses.includes(status)) {
      redirect("/cms?status=error&message=Invalid%20application%20status%20update.");
    }

    if (!hasSubmissionStatus) {
      redirect("/cms?status=error&message=Applications%20status%20column%20is%20missing.%20Run%20Supabase%20migrations.");
    }

    try {
      await updateGetInvolvedSubmissionStatus(id, status);
    } catch (error) {
      const message = (error as { code?: string; message?: string })?.code === "PGRST204"
        ? "Applications status column is missing. Run Supabase migrations."
        : (error as Error).message || "Failed to update application status.";
      redirect(`/cms?status=error&message=${encodeURIComponent(message)}`);
    }
    revalidatePath("/cms");
  }

  async function inviteAdminUser(formData: FormData) {
    "use server";
    const authClient = await createServerSupabaseAuthClient();
    const { data: currentUser } = await authClient.auth.getUser();
    const validSession = isCmsAuthorizedUser(currentUser.user);
    const hasPermission = hasCmsPermission(currentUser.user, "manage_admins");
    if (!validSession || !hasPermission) {
      redirect("/cms?status=error&message=Unauthorized.");
    }

    const email = String(formData.get("email") || "").trim().toLowerCase();
    const role = String(formData.get("role") || "").trim().toLowerCase() as CmsAdminRole;
    const allowedRoles: CmsAdminRole[] = ["super_admin", "content_admin", "applications_admin", "viewer"];
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      redirect("/cms?status=error&message=Please%20enter%20a%20valid%20email%20address.");
    }
    if (!allowedRoles.includes(role)) {
      redirect("/cms?status=error&message=Invalid%20role.");
    }

    const serviceClient = createServiceSupabaseClient();
    if (!serviceClient) {
      redirect("/cms?status=error&message=Supabase%20service%20credentials%20missing.");
    }

    const { error } = await serviceClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/cms`,
      data: {
        cms_admin: true,
        role,
        roles: [role],
      },
    });

    if (error) {
      const isRateLimit = error.message.toLowerCase().includes("rate limit");
      if (isRateLimit) {
        redirect(
          `/cms?status=ok&message=${encodeURIComponent(
            `Invite for ${email} is already pending (email rate limit reached). Try again later.`
          )}`
        );
      }
      redirect(`/cms?status=error&message=${encodeURIComponent(error.message)}`);
    }

    redirect(`/cms?status=ok&message=${encodeURIComponent(`Invite sent to ${email}.`)}`);
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-12 text-text sm:px-6 lg:px-8">
      <div className="section-blur-green pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full blur-3xl" />
      <div className="section-blur-gold pointer-events-none absolute right-0 top-28 h-80 w-80 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl space-y-8">
        <header className="soft-panel rounded-3xl p-6 sm:p-8">
          <div className="inline-flex rounded-full border border-green/20 bg-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-green">
            CMS Console
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Manage <span className="hero-gradient-text">Site Content</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-muted sm:text-base">
            High-fidelity editor for homepage and members content. Changes save to Supabase and publish immediately.
          </p>
        </header>

        {!isAuthorized ? (
          <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-panel to-bg p-1 shadow-card">
            <div className="rounded-[1.7rem] border border-white/10 bg-bg/80 p-7 backdrop-blur-xl sm:p-9">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl font-bold">Sign in to CMS</h2>
                <div className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.12em] text-muted">
                  Secure
                </div>
              </div>
              <p className="mt-2 text-sm text-muted">Choose your preferred method to access the admin dashboard.</p>

              <CMSAuthAssist
                siteUrl={getSiteUrl()}
                initialStatus={status === "ok" || status === "error" ? status : undefined}
                initialMessage={message ? decodeURIComponent(message) : undefined}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {status && message ? (
              <div
                className={`rounded-2xl border p-4 text-sm ${
                  status === "ok" ? "border-green/30 bg-green/10 text-green" : "border-red-400/40 bg-red-500/10 text-red-200"
                }`}
              >
                {decodeURIComponent(message)}
              </div>
            ) : null}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-xs uppercase tracking-[0.12em] text-muted">
              Your role: <span className="font-semibold text-text">{currentRole.replace("_", " ")}</span>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <form action={logout}>
                <LogoutSubmitButton />
              </form>
            </div>
            {canManageAdmins ? (
              <section className="rounded-3xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-6 backdrop-blur-md">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Invite Admin User</h2>
                    <p className="mt-1 text-sm text-muted">
                      Sends a secure invite email. Assign a scoped role for content, applications, or full admin access.
                    </p>
                  </div>
                  <InviteAdminForm action={inviteAdminUser} />
                </div>
              </section>
            ) : null}
            <section className="rounded-3xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-6 backdrop-blur-md">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold">Current Admins</h2>
                  <p className="mt-1 text-sm text-muted">Users with `cms_admin` claim/role or included in `CMS_ADMIN_EMAILS`.</p>
                </div>
                <div className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs uppercase tracking-[0.12em] text-muted">
                  {admins.length} admins
                </div>
              </div>

              {admins.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-sm text-muted">
                  No admin users found.
                </div>
              ) : (
                <div className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.06]">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-white/[0.02] text-xs uppercase tracking-[0.08em] text-muted">
                      <tr>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Access Source</th>
                        <th className="px-4 py-3">Created</th>
                        <th className="px-4 py-3">Last Sign-in</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr key={admin.id} className="border-t border-white/[0.06] align-top">
                          <td className="px-4 py-3 font-medium text-text">{admin.email}</td>
                          <td className="px-4 py-3 text-muted">{admin.role.replace("_", " ")}</td>
                          <td className="px-4 py-3 text-muted">{admin.source === "claim" ? "Claim/Role" : "Allowlist"}</td>
                          <td className="px-4 py-3 text-muted">
                            {admin.createdAt
                              ? new Date(admin.createdAt).toLocaleString("en-AU", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-muted">
                            {admin.lastSignInAt
                              ? new Date(admin.lastSignInAt).toLocaleString("en-AU", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Never"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
            {canManageContent ? <CMSEditor initialContent={content} saveSection={saveSection} /> : null}
            {canManageContent ? <SiteSettingsEditor initialSite={site} saveSiteSection={saveSiteSectionAction} /> : null}
            <section className="rounded-3xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-6 backdrop-blur-md">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div>
                  <h2 className="font-display text-3xl">Get Involved Applications</h2>
                  <p className="mt-1 text-sm text-muted">Recent form submissions from the public Get Involved page.</p>
                </div>
                <div className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs uppercase tracking-[0.12em] text-muted">
                  {submissions.length} total
                </div>
              </div>

              {!hasSubmissionStatus ? (
                <div className="mt-4 rounded-xl border border-amber-300/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  Status controls are disabled because the `status` column is not in your database yet. Run migrations and reload `/cms`.
                </div>
              ) : null}

              {submissions.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-sm text-muted">
                  No submissions yet.
                </div>
              ) : (
                <div className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.06]">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-white/[0.02] text-xs uppercase tracking-[0.08em] text-muted">
                      <tr>
                        <th className="px-4 py-3">Submitted</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Links</th>
                        <th className="px-4 py-3">Skills</th>
                        <th className="px-4 py-3">Looking For</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSubmissions.map((entry) => (
                        <tr key={entry.id} className="border-t border-white/[0.06] align-top">
                          <td className="whitespace-nowrap px-4 py-3 text-white/80">
                            {new Date(entry.created_at).toLocaleString("en-AU", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-3 font-medium text-text">{entry.name}</td>
                          <td className="px-4 py-3 text-muted">{entry.role_area}</td>
                          <td className="px-4 py-3 text-muted">{entry.location || "—"}</td>
                          <td className="px-4 py-3">
                            <form action={updateApplicationStatus} className="flex items-center gap-2">
                              <input type="hidden" name="id" value={entry.id} />
                              <span
                                className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getStatusBadgeClass(
                                  entry.status || "new"
                                )}`}
                              >
                                {entry.status || "new"}
                              </span>
                              <select
                                name="status"
                                defaultValue={entry.status || "new"}
                                disabled={!hasSubmissionStatus || !canManageApplications}
                                className="min-w-[130px] rounded-lg border border-white/[0.08] bg-white/[0.02] px-2 py-1.5 text-xs uppercase tracking-[0.08em] text-text outline-none ring-green/35 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="new">New</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                              </select>
                              <ApplicationStatusSubmitButton
                                disabled={!hasSubmissionStatus || !canManageApplications}
                              />
                            </form>
                          </td>
                          <td className="px-4 py-3 text-muted">
                            <div className="flex flex-col gap-1">
                              {entry.twitter_url ? (
                                <a href={entry.twitter_url} target="_blank" rel="noreferrer noopener" className="text-green hover:underline">
                                  Twitter/X
                                </a>
                              ) : null}
                              {entry.github_url ? (
                                <a href={entry.github_url} target="_blank" rel="noreferrer noopener" className="text-green hover:underline">
                                  GitHub
                                </a>
                              ) : null}
                              {entry.portfolio_url ? (
                                <a href={entry.portfolio_url} target="_blank" rel="noreferrer noopener" className="text-green hover:underline">
                                  Portfolio
                                </a>
                              ) : !entry.twitter_url && !entry.github_url ? (
                                <span>—</span>
                              ) : null}
                            </div>
                          </td>
                          <td className="max-w-[320px] px-4 py-3 text-muted">{entry.skills}</td>
                          <td className="max-w-[320px] px-4 py-3 text-muted">{entry.looking_for}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
