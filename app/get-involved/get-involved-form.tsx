"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Briefcase, CircleDollarSign, Gift, Star, Users } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { InterestIconKey, SiteContent } from "@/lib/types";

const INTEREST_ICONS: Record<InterestIconKey, typeof Gift> = {
  bounties: Gift,
  grants: CircleDollarSign,
  networking: Users,
  jobs: Briefcase,
};

type FormData = {
  name: string;
  location: string;
  twitterHandle: string;
  roleArea: string;
  skills: string;
  portfolioUrl: string;
  githubUrl: string;
  interests: string[];
};

const INITIAL: FormData = {
  name: "",
  location: "",
  twitterHandle: "",
  roleArea: "",
  skills: "",
  portfolioUrl: "",
  githubUrl: "",
  interests: [],
};

const STEPS = [
  { phase: "Identity", label: "Personal" },
  { phase: "Expertise", label: "Profile" },
  { phase: "Alignment", label: "Interests" },
] as const;

const TOTAL = 3;

function normalizeTwitterUrl(handle: string): string {
  const t = handle.trim().replace(/^@+/, "");
  if (!t) return "";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  return `https://x.com/${t}`;
}

function normalizeGithubUrl(handle: string): string {
  const t = handle
    .trim()
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/^@+/, "")
    .replace(/^\/+/, "");
  if (!t) return "";
  return `https://github.com/${t}`;
}

type Props = {
  site: SiteContent;
};

function RequiredAsterisk() {
  return <span className="ml-1 text-red-400">*</span>;
}

export function GetInvolvedForm({ site }: Props) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>(() => ({
    ...INITIAL,
    roleArea: site.primaryRoles[0]?.value ?? "",
  }));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const progressPercent = ((step - 1) / (TOTAL - 1)) * 100;

  const { interestCards, primaryRoles, auStates, getInvolvedPage } = site;

  const roleSet = useMemo(() => new Set(primaryRoles.map((r) => r.value)), [primaryRoles]);
  const stateSet = useMemo(() => new Set(auStates.map((s) => s.value)), [auStates]);

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleInterest = useCallback((id: string) => {
    setForm((prev) => {
      const has = prev.interests.includes(id);
      return {
        ...prev,
        interests: has ? prev.interests.filter((x) => x !== id) : [...prev.interests, id],
      };
    });
  }, []);

  const validateStep = useCallback(
    (s: number): string => {
      if (s === 1) {
        if (!form.name.trim()) return "Legal name is required.";
        if (!form.location.trim()) return "Select your state.";
        if (!stateSet.has(form.location)) return "Select a valid state.";
      }
      if (s === 2) {
        if (!form.roleArea.trim()) return "Choose your primary focus.";
        if (!roleSet.has(form.roleArea)) return "Choose a valid primary focus.";
        if (!form.skills.trim()) return "Add your key skills.";
      }
      if (s === 3) {
        if (form.interests.length === 0) return "Select at least one interest.";
      }
      return "";
    },
    [form, roleSet, stateSet]
  );

  const goNext = () => {
    const err = validateStep(step);
    setError(err);
    if (err) return;
    setDirection(1);
    setStep((x) => Math.min(TOTAL, x + 1));
  };

  const goBack = () => {
    setError("");
    setDirection(-1);
    setStep((x) => Math.max(1, x - 1));
  };

  const submit = async () => {
    setError("");
    setSuccess("");
    const err = validateStep(3);
    if (err) {
      setError(err);
      return;
    }

    setIsSubmitting(true);
    try {
      const lookingFor = form.interests.join(", ");
      const res = await fetch("/api/get-involved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          location: form.location,
          roleArea: form.roleArea,
          skills: form.skills,
          experienceLevel: "",
          twitterUrl: normalizeTwitterUrl(form.twitterHandle),
          githubUrl: normalizeGithubUrl(form.githubUrl),
          portfolioUrl: form.portfolioUrl,
          lookingFor,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Failed to submit.");
        return;
      }
      setSuccess("Application submitted. Welcome to the frontier.");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (interestCards.length === 0 || primaryRoles.length === 0 || auStates.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        Get Involved form options are not configured. Add interest cards, roles, and states in Supabase or the CMS.
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-[760px]">
        <div className="rounded-[2rem] border border-green/25 bg-green/[0.08] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green">Application submitted</p>
          <h2 className="mt-4 font-display text-3xl font-bold text-text sm:text-4xl">Welcome to the frontier.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Thanks for applying to Superteam Australia. We&apos;ll review your details and reach out with next steps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="get-involved-application" className="flex w-full max-w-[896px] flex-col gap-12 sm:gap-16">
      <div className="space-y-6" data-node-id="2:465">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Application Progress</p>
            <p className="mt-2 text-sm text-muted">Step {step} of {TOTAL}</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
            {STEPS[step - 1]?.label}
          </div>
        </div>

        <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#68de87_0%,#ffb953_100%)]"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: reduceMotion ? 0.12 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 w-24 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.3),rgba(255,255,255,0))]"
            animate={{ x: ["-30%", "440%"] }}
            transition={{ duration: 2.2, ease: "linear", repeat: Infinity }}
          />
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-4 sm:gap-6 md:gap-8">
          {STEPS.map((st, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            const muted = !active && !done;
            return (
              <div key={st.label} className={`flex min-w-[150px] flex-1 items-center gap-4 ${muted ? "opacity-55" : ""}`}>
                {i > 0 ? (
                  <div className="hidden h-px flex-1 bg-white/[0.08] md:block">
                    <motion.div
                      className="h-px bg-green"
                      initial={false}
                      animate={{ width: done ? "100%" : active ? "55%" : "0%" }}
                      transition={{ duration: reduceMotion ? 0.12 : 0.4, ease: "easeOut" }}
                    />
                  </div>
                ) : null}
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{
                      scale: active ? 1.06 : 1,
                      borderColor: active ? "rgba(104,222,135,1)" : done ? "rgba(104,222,135,0.8)" : "rgba(135,148,134,1)",
                    }}
                    transition={{ duration: reduceMotion ? 0.12 : 0.3 }}
                    className={`flex size-11 shrink-0 items-center justify-center rounded-full border-2 bg-[rgba(18,19,22,0.8)] p-0.5 text-base font-semibold ${
                      active
                        ? "text-green shadow-[0_0_18px_rgba(104,222,135,0.22)]"
                        : done
                          ? "text-green"
                          : "text-text"
                    }`}
                  >
                    {n}
                  </motion.div>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${active ? "text-green" : "text-muted"}`}>
                      {st.phase}
                    </p>
                    <p className="font-display text-lg font-bold leading-7 text-text">{st.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-8 sm:gap-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? 28 : -28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? -20 : 20 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {step === 1 ? (
              <section
                className="relative w-full rounded-[32px] border border-white/[0.05] bg-[rgba(51,53,56,0.4)] p-6 backdrop-blur-[10px] sm:rounded-[40px] sm:p-[49px] sm:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
                data-node-id="2:493"
              >
                <h2 className="text-center font-display text-[30px] font-bold leading-9 text-text">
                  Personal Information
                </h2>
                <div className="mt-10 flex flex-col gap-10">
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      Legal Name
                      <RequiredAsterisk />
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Wade Wilson"
                      autoComplete="name"
                      className="w-full rounded-xl border border-white/[0.05] bg-[rgba(51,53,56,0.5)] px-6 py-[19px] text-base text-text placeholder:text-[#3e4a3e] outline-none ring-green/30 focus:ring-2"
                    />
                  </div>
                  <div className="grid gap-10 sm:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                        Location (AU State)
                        <RequiredAsterisk />
                      </label>
                      <select
                        value={form.location}
                        onChange={(e) => update("location", e.target.value)}
                        className="h-[58px] w-full appearance-none rounded-xl border border-white/[0.05] bg-[rgba(51,53,56,0.5)] px-6 text-base text-text outline-none ring-green/30 focus:ring-2"
                      >
                        <option value="">Select state</option>
                        {auStates.map((st) => (
                          <option key={st.value} value={st.value}>
                            {st.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                        Twitter / X Handle
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-base text-[#3e4a3e]">
                          @
                        </span>
                        <input
                          value={form.twitterHandle}
                          onChange={(e) => update("twitterHandle", e.target.value.replace(/^@+/, ""))}
                          placeholder="handle"
                          className="w-full rounded-xl border border-white/[0.05] bg-[rgba(51,53,56,0.5)] py-[19px] pl-10 pr-6 text-base text-text placeholder:text-[#3e4a3e] outline-none ring-green/30 focus:ring-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <section
                className="w-full rounded-[32px] border border-white/[0.05] bg-[rgba(26,28,31,0.4)] p-6 sm:rounded-[40px] sm:p-[49px]"
                data-node-id="2:522"
              >
                <h2 className="text-center font-display text-[30px] font-bold leading-9 text-text">Professional Profile</h2>
                <div className="mt-10 flex flex-col gap-10">
                  <div className="flex flex-col gap-6">
                    <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      What is your primary focus?
                      <RequiredAsterisk />
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {primaryRoles.map((role) => {
                        const selected = form.roleArea === role.value;
                        return (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => update("roleArea", role.value)}
                            className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition sm:px-8 sm:py-3 sm:text-base ${
                              selected
                                ? "border-green text-green shadow-[0_0_10px_rgba(104,222,135,0.1)]"
                                : "border-[rgba(62,74,62,0.3)] font-normal text-muted hover:border-white/20"
                            }`}
                          >
                            {role.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      Key Skills (Comma Separated)
                      <RequiredAsterisk />
                    </label>
                    <textarea
                      value={form.skills}
                      onChange={(e) => update("skills", e.target.value)}
                      placeholder="Rust, Typescript, UI/UX Design, Strategy..."
                      rows={4}
                      className="w-full resize-y rounded-xl border border-white/[0.05] bg-[rgba(51,53,56,0.5)] px-6 py-4 text-base leading-6 text-text placeholder:text-[#3e4a3e] outline-none ring-green/30 focus:ring-2"
                    />
                  </div>
                  <div className="grid gap-10 sm:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                        Portfolio / Site Link
                      </label>
                      <input
                        value={form.portfolioUrl}
                        onChange={(e) => update("portfolioUrl", e.target.value)}
                        placeholder="https://"
                        className="w-full rounded-xl border border-white/[0.05] bg-[rgba(51,53,56,0.5)] px-6 py-[19px] text-base text-text placeholder:text-[#3e4a3e] outline-none ring-green/30 focus:ring-2"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">GitHub Handle</label>
                      <div className="overflow-hidden rounded-xl border border-white/[0.05] bg-[rgba(51,53,56,0.5)] ring-green/30 focus-within:ring-2">
                        <div className="flex items-center">
                          <span className="hidden shrink-0 border-r border-white/[0.05] px-4 py-[19px] text-sm text-[#7b8677] sm:inline-flex">
                            https://github.com/
                          </span>
                          <span className="shrink-0 border-r border-white/[0.05] px-4 py-[19px] text-sm text-[#7b8677] sm:hidden">
                            github.com/
                          </span>
                          <span className="shrink-0 px-2 text-base text-[#3e4a3e]">@</span>
                          <input
                            value={form.githubUrl}
                            onChange={(e) =>
                              update(
                                "githubUrl",
                                e.target.value
                                  .replace(/^https?:\/\/github\.com\//, "")
                                  .replace(/^@+/, "")
                                  .replace(/^\/+/, "")
                              )
                            }
                            placeholder="your-handle"
                            className="min-w-0 flex-1 bg-transparent py-[19px] pl-1 pr-6 text-base text-text placeholder:text-[#3e4a3e] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {step === 3 ? (
              <section
                className="w-full rounded-[32px] border border-white/[0.05] bg-[rgba(51,53,56,0.4)] p-6 backdrop-blur-[10px] sm:rounded-[40px] sm:p-[49px]"
                data-node-id="2:559"
              >
                <h2 className="text-center font-display text-[30px] font-bold leading-9 text-text">
                  What are you looking for?
                  <RequiredAsterisk />
                </h2>
                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                  {interestCards.map((card) => {
                    const selected = form.interests.includes(card.id);
                    const Icon = INTEREST_ICONS[card.iconKey] ?? Gift;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => toggleInterest(card.id)}
                        className={`flex flex-col items-center gap-2 rounded-[24px] border p-8 text-center transition ${
                          selected
                            ? "border-green bg-[rgba(104,222,135,0.08)] shadow-[0_0_20px_rgba(104,222,135,0.12)]"
                            : "border-white/[0.05] bg-[rgba(51,53,56,0.3)] hover:border-white/15"
                        }`}
                      >
                        <div className="relative h-8 w-9 shrink-0 text-green">
                          <Icon className="h-full w-full" aria-hidden />
                        </div>
                        <h3 className="pt-2 text-xl font-semibold text-text">{card.title}</h3>
                        <p className="text-sm leading-5 text-muted">{card.description}</p>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {step === 3 ? (
          <div
            className="relative mx-auto w-full max-w-md overflow-hidden rounded-[24px] border border-white/[0.05] bg-[#1a1c1f] p-8"
            data-node-id="2:591"
          >
            <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-gold">{getInvolvedPage.perkTitle}</p>
            <p className="mt-3 text-center text-sm leading-[1.4] text-muted">{getInvolvedPage.perkBody}</p>
            <Star
              className="pointer-events-none absolute -bottom-2 -right-4 size-28 rotate-12 text-text/[0.06]"
              strokeWidth={1}
              aria-hidden
            />
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-6 pt-2">
          {error ? (
            <div className="w-full max-w-md rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="w-full max-w-md rounded-xl border border-green/30 bg-green/10 px-4 py-3 text-center text-sm text-green">
              {success}
            </div>
          ) : null}

          {step === 3 ? (
            <>
              <div className="flex w-full max-w-md items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={isSubmitting}
                  className="rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-muted transition hover:text-text disabled:opacity-40"
                >
                  Back
                </button>
                <div className="text-right text-xs uppercase tracking-[0.12em] text-muted">Final step</div>
              </div>
              <p className="max-w-sm text-center text-sm leading-5 text-[#879486]">{getInvolvedPage.privacyNote}</p>
              <button
                type="button"
                onClick={submit}
                disabled={isSubmitting}
                className="w-full max-w-md rounded-2xl bg-green px-16 py-5 text-center text-xl font-semibold text-[#003917] transition hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-60"
                data-node-id="2:600"
              >
                {isSubmitting ? "Submitting…" : "Submit Application"}
              </button>
            </>
          ) : (
            <div className="flex w-full max-w-md flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1 || isSubmitting}
                className="rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-muted transition hover:text-text disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={isSubmitting}
                className="rounded-2xl bg-green px-10 py-3 text-sm font-bold text-[#003917] transition hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-60"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
