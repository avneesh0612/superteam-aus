"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { useCallback, useState } from "react";

/** Figma asset URLs (node 2:436) — valid ~7 days; replace with local assets if needed. */
const ASSET_BOUNTIES = "https://www.figma.com/api/mcp/asset/d8d7844a-b8ca-475c-9a2a-f241170ed218";
const ASSET_GRANTS = "https://www.figma.com/api/mcp/asset/f8b2da25-6c12-4781-8979-ea2f004e6f9e";
const ASSET_NETWORKING = "https://www.figma.com/api/mcp/asset/5408359d-4eb8-4dab-982f-4be5743ea1f3";
const ASSET_JOBS = "https://www.figma.com/api/mcp/asset/27cf1c25-5511-497f-ab26-fe105ec81b4f";

const PRIMARY_FOCUS = ["Builder", "Designer", "Founder", "Content Creator", "Community Lead"] as const;

const AU_STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"] as const;

const INTEREST_CARDS = [
  {
    id: "Bounties",
    title: "Bounties",
    description: "Earn USDC by completing ecosystem tasks.",
    icon: ASSET_BOUNTIES,
  },
  {
    id: "Grants",
    title: "Grants",
    description: "Seed funding for your next big project.",
    icon: ASSET_GRANTS,
  },
  {
    id: "Networking",
    title: "Networking",
    description: "Connect with the top 1% of AU talent.",
    icon: ASSET_NETWORKING,
  },
  {
    id: "Jobs",
    title: "Jobs",
    description: "Full-time roles within the ecosystem.",
    icon: ASSET_JOBS,
  },
] as const;

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
  roleArea: "Builder",
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

export function GetInvolvedForm() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
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
      }
      if (s === 2) {
        if (!form.roleArea.trim()) return "Choose your primary focus.";
        if (!form.skills.trim()) return "Add your key skills.";
      }
      if (s === 3) {
        if (form.interests.length === 0) return "Select at least one interest.";
      }
      return "";
    },
    [form]
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
          githubUrl: form.githubUrl,
          portfolioUrl: form.portfolioUrl,
          lookingFor,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit.");
        return;
      }
      setSuccess("Application submitted. Welcome to the frontier.");
      setForm(INITIAL);
      setStep(1);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="get-involved-application" className="flex w-full max-w-[896px] flex-col gap-24">
      {/* Horizontal progress — Figma node 2:465 */}
      <div
        className="flex w-full flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-16"
        data-node-id="2:465"
      >
        {STEPS.map((s, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          const muted = !active && !done;
          return (
            <div key={s.label} className="flex items-center gap-4">
              {i > 0 ? <div className="hidden h-0.5 w-8 shrink-0 bg-[rgba(62,74,62,0.3)] sm:block md:w-12" /> : null}
              <div className={`flex items-center gap-4 ${muted ? "opacity-40" : ""}`}>
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 p-0.5 text-base font-semibold ${
                    active
                      ? "border-green text-green shadow-[0_0_15px_rgba(104,222,135,0.3)]"
                      : done
                        ? "border-green/80 text-green"
                        : "border-[#879486] text-text"
                  }`}
                >
                  {n}
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${active ? "text-green" : "text-muted"}`}>
                    {s.phase}
                  </p>
                  <p className="font-display text-lg font-bold leading-7 text-text">{s.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction > 0 ? 28 : -28 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction > 0 ? -20 : 20 }
            }
            transition={{ duration: reduceMotion ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {step === 1 ? (
              <section
                className="relative w-full rounded-[40px] border border-white/[0.05] bg-[rgba(51,53,56,0.4)] p-8 backdrop-blur-[10px] sm:p-[49px] sm:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
                data-node-id="2:493"
              >
                <h2 className="text-center font-display text-[30px] font-bold leading-9 text-text">
                  Personal Information
                </h2>
                <div className="mt-10 flex flex-col gap-10">
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Legal Name</label>
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
                      </label>
                      <select
                        value={form.location}
                        onChange={(e) => update("location", e.target.value)}
                        className="h-[58px] w-full appearance-none rounded-xl border border-white/[0.05] bg-[rgba(51,53,56,0.5)] px-6 text-base text-text outline-none ring-green/30 focus:ring-2"
                      >
                        <option value="">Select state</option>
                        {AU_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
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
                className="w-full rounded-[40px] border border-white/[0.05] bg-[rgba(26,28,31,0.4)] p-8 sm:p-[49px]"
                data-node-id="2:522"
              >
                <h2 className="text-center font-display text-[30px] font-bold leading-9 text-text">Professional Profile</h2>
                <div className="mt-10 flex flex-col gap-10">
                  <div className="flex flex-col gap-6">
                    <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      What is your primary focus?
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {PRIMARY_FOCUS.map((label) => {
                        const selected = form.roleArea === label;
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => update("roleArea", label)}
                            className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition sm:px-8 sm:py-3 sm:text-base ${
                              selected
                                ? "border-green text-green shadow-[0_0_10px_rgba(104,222,135,0.1)]"
                                : "border-[rgba(62,74,62,0.3)] font-normal text-muted hover:border-white/20"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      Key Skills (Comma Separated)
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
                      <label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">GitHub Link</label>
                      <input
                        value={form.githubUrl}
                        onChange={(e) => update("githubUrl", e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full rounded-xl border border-white/[0.05] bg-[rgba(51,53,56,0.5)] px-6 py-[19px] text-base text-text placeholder:text-[#3e4a3e] outline-none ring-green/30 focus:ring-2"
                      />
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {step === 3 ? (
              <section
                className="w-full rounded-[40px] border border-white/[0.05] bg-[rgba(51,53,56,0.4)] p-8 backdrop-blur-[10px] sm:p-[49px]"
                data-node-id="2:559"
              >
                <h2 className="text-center font-display text-[30px] font-bold leading-9 text-text">
                  What are you looking for?
                </h2>
                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                  {INTEREST_CARDS.map((card) => {
                    const selected = form.interests.includes(card.id);
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
                        <div className="relative h-8 w-9 shrink-0">
                          <img alt="" src={card.icon} className="h-full w-full object-contain" />
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
            <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-gold">Member Perk</p>
            <p className="mt-3 text-center text-sm leading-[1.4] text-muted">
              Applicants from Australia gain priority access to exclusive ST Australia bounties and coworking retreats.
            </p>
            <Star
              className="pointer-events-none absolute -bottom-2 -right-4 size-28 rotate-12 text-text/[0.06]"
              strokeWidth={1}
              aria-hidden
            />
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-8 pt-4">
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
              <button
                type="button"
                onClick={goBack}
                disabled={isSubmitting}
                className="text-sm text-muted underline-offset-4 hover:text-text hover:underline"
              >
                ← Back
              </button>
              <p className="max-w-sm text-center text-sm leading-5 text-[#879486]">
                Your data is stored securely and only visible to core contributors.
              </p>
              <button
                type="button"
                onClick={submit}
                disabled={isSubmitting}
                className="w-full max-w-md rounded-2xl bg-green px-16 py-5 text-center text-xl font-semibold text-[#003917] transition hover:opacity-95 disabled:opacity-60"
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
                className="rounded-2xl bg-green px-10 py-3 text-sm font-bold text-[#003917] transition hover:opacity-95 disabled:opacity-60"
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
