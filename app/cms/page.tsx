import { getCmsContent, upsertCmsContent } from "@/lib/cms";
import { redirect } from "next/navigation";
import { CMSEditor } from "@/app/cms/cms-editor";
import { createServerSupabaseAuthClient, getSiteUrl, isCmsAuthorizedUser } from "@/lib/supabase-auth";
import { CMSAuthAssist } from "@/app/cms/cms-auth-assist";
import { Metadata } from "next";

type CMSKey = "navLinks" | "stats" | "missionCards" | "events" | "members" | "partners" | "announcements" | "testimonials" | "faqs";

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
  searchParams?: { status?: string; message?: string };
}) {
  const supabase = await createServerSupabaseAuthClient();
  const { data: userData } = await supabase.auth.getUser();
  const isAuthorized = isCmsAuthorizedUser(userData.user);
  const content = await getCmsContent();
  const status = searchParams?.status;
  const message = searchParams?.message;

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

    if (!validSession) {
      redirect("/cms?status=error&message=Unauthorized.");
    }

    if (typeof key !== "string" || typeof payload !== "string") {
      throw new Error("Invalid save request.");
    }

    const parsed = JSON.parse(payload);
    await upsertCmsContent(key as CMSKey, parsed);
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
            <form action={logout} className="flex justify-end">
              <button
                type="submit"
                className="rounded-xl border border-white/20 bg-white/[0.03] px-4 py-2 text-sm text-muted transition hover:text-text"
              >
                Logout
              </button>
            </form>
            <CMSEditor initialContent={content} saveSection={saveSection} />
          </div>
        )}
      </div>
    </main>
  );
}
