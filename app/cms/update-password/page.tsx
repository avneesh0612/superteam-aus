 "use client";

import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdatePasswordPage() {
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  async function updatePassword(formData: FormData) {
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    setStatus("");
    setError("");

    if (typeof password !== "string" || typeof confirmPassword !== "string") {
      setError("Invalid form submission.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setStatus("Password updated. Redirecting to CMS...");
    setTimeout(() => {
      router.replace("/cms?status=ok&message=Password%20updated.%20You%20can%20now%20sign%20in.");
    }, 600);
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-12 text-text sm:px-6 lg:px-8">
      <div className="section-blur-green pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full blur-3xl" />
      <div className="section-blur-gold pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-xl space-y-6 rounded-3xl border border-white/10 bg-panel p-8 shadow-card">
        <div className="inline-flex rounded-full border border-green/20 bg-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-green">
          Secure Account
        </div>
        <h1 className="font-display text-4xl font-bold">
          Update <span className="hero-gradient-text">Password</span>
        </h1>
        <p className="text-sm text-muted">Set a new password for your CMS admin account.</p>

        {status ? <div className="rounded-2xl border border-green/30 bg-green/10 p-4 text-sm text-green">{status}</div> : null}
        {error ? <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-300">{error}</div> : null}

        <form action={updatePassword} className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="New password"
            className="w-full rounded-xl border border-white/10 bg-bg px-4 py-3 text-sm text-text outline-none ring-green/40 transition focus:ring-2"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-white/10 bg-bg px-4 py-3 text-sm text-text outline-none ring-green/40 transition focus:ring-2"
          />
          <button
            type="submit"
            className="w-full rounded-xl border border-green/30 bg-green/20 px-4 py-2.5 text-sm font-semibold text-green transition hover:bg-green/30"
          >
            Update Password
          </button>
        </form>
      </div>
    </main>
  );
}
