"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Props = {
  siteUrl: string;
  initialStatus?: "ok" | "error";
  initialMessage?: string;
};

type AuthMode = "password" | "magic" | "reset";

type Toast = {
  id: number;
  type: "success" | "error";
  message: string;
};

export function CMSAuthAssist({ siteUrl, initialStatus, initialMessage }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (!initialStatus || !initialMessage) return;
    enqueueToast(initialStatus === "ok" ? "success" : "error", initialMessage);
  }, [initialStatus, initialMessage]);

  function enqueueToast(type: Toast["type"], message: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3600);
  }

  const cta = useMemo(() => {
    if (mode === "password") return "Sign In";
    if (mode === "magic") return "Send Magic Link";
    return "Send Reset Link";
  }, [mode]);

  async function onSubmit() {
    if (!email.trim()) {
      enqueueToast("error", "Please enter a valid email.");
      return;
    }

    if (mode === "password" && !password.trim()) {
      enqueueToast("error", "Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const supabase = createBrowserSupabaseClient();
      const normalizedEmail = email.trim().toLowerCase();

      if (mode === "password") {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) {
          enqueueToast("error", error.message);
          return;
        }
        enqueueToast("success", "Signed in successfully.");
        router.replace("/cms");
        router.refresh();
        return;
      }

      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email: normalizedEmail,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: `${siteUrl}/auth/callback?next=/cms`,
          },
        });
        if (error) {
          enqueueToast("error", error.message);
          return;
        }
        enqueueToast("success", "Magic link sent. Check your email.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${siteUrl}/auth/callback?next=/cms/update-password`,
      });
      if (error) {
        enqueueToast("error", error.message);
        return;
      }
      enqueueToast("success", "Password reset email sent.");
    } catch (err) {
      enqueueToast("error", (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className={`rounded-xl border px-4 py-3 text-sm shadow-card ${
                toast.type === "success" ? "border-green/30 bg-green/10 text-green" : "border-red-400/40 bg-red-500/10 text-red-200"
              }`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-panel p-5">
        <Tabs value={mode} onValueChange={(value) => setMode(value as AuthMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="magic">Magic Link</TabsTrigger>
            <TabsTrigger value="reset">Reset</TabsTrigger>
          </TabsList>

          <TabsContent value={mode}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-3"
            >
              <p className="text-sm font-semibold text-text">
                {mode === "password" ? "Sign in with password" : mode === "magic" ? "Send a magic link" : "Reset your password"}
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@yourdomain.com"
                className="w-full rounded-xl border border-white/10 bg-bg px-3 py-2.5 text-sm text-text outline-none ring-green/40 transition focus:ring-2"
              />
              {mode === "password" ? (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-white/10 bg-bg px-3 py-2.5 text-sm text-text outline-none ring-green/40 transition focus:ring-2"
                />
              ) : null}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onSubmit}
                className="w-full rounded-xl border border-white/20 bg-white/[0.03] px-4 py-2.5 text-sm text-muted transition hover:text-text disabled:opacity-60"
              >
                {isSubmitting ? "Working..." : cta}
              </button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
