import { Suspense } from "react";
import { AuthCallbackClient } from "./auth-callback-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth Callback",
  description: "Authentication callback processing page.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackClient />
    </Suspense>
  );
}

function AuthCallbackFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 text-text">
      <div className="space-y-4 rounded-2xl border border-white/10 bg-panel px-8 py-7 text-center shadow-card">
        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-green" />
        <div className="text-sm text-muted">Completing sign-in...</div>
      </div>
    </main>
  );
}
