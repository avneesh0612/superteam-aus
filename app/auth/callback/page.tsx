"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusText, setStatusText] = useState("Completing sign-in...");

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createBrowserSupabaseClient();
      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      const errorDescription = searchParams.get("error_description");
      const nextParam = searchParams.get("next") || "/cms";
      const safeNext = nextParam.startsWith("/") ? nextParam : "/cms";
      const resolvedNext = type === "recovery" ? "/cms/update-password" : safeNext;

      if (errorDescription) {
        setStatusText("Sign-in failed. Redirecting...");
        router.replace(`/cms?status=error&message=${encodeURIComponent(errorDescription)}`);
        return;
      }

      if (code) {
        setStatusText("Verifying secure callback...");
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatusText("Sign-in failed. Redirecting...");
          router.replace(`/cms?status=error&message=${encodeURIComponent(error.message)}`);
          return;
        }
        setStatusText("Authenticated. Redirecting...");
        router.replace(resolvedNext);
        return;
      }

      if (tokenHash && type) {
        setStatusText("Verifying one-time token...");
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "magiclink" | "recovery" | "invite" | "email_change" | "email",
        });
        if (error) {
          setStatusText("Token verification failed. Redirecting...");
          router.replace(`/cms?status=error&message=${encodeURIComponent(error.message)}`);
          return;
        }
        setStatusText("Verified. Redirecting...");
        router.replace(resolvedNext);
        return;
      }

      setStatusText("Invalid callback. Redirecting...");
      router.replace("/cms?status=error&message=Missing%20auth%20callback%20params.");
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 text-text">
      <div className="space-y-4 rounded-2xl border border-white/10 bg-panel px-8 py-7 text-center shadow-card">
        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-green" />
        <div className="text-sm text-muted">{statusText}</div>
      </div>
    </main>
  );
}
