"use client";

import type { ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";
import type {
  FooterLink,
  InterestCardConfig,
  InterestIconKey,
  SelectOption,
  SiteContent,
  SiteSectionKey,
} from "@/lib/types";

type Props = {
  initialSite: SiteContent;
  saveSiteSection: (key: SiteSectionKey, payload: string) => Promise<void>;
};

const SECTION_LABELS: Record<SiteSectionKey, string> = {
  hero: "Homepage hero",
  cta: "Homepage CTA band",
  footerMeta: "Footer branding",
  footerLinks: "Footer links (both layouts)",
  getInvolvedPage: "Get Involved page copy",
  interestCards: "Get Involved — interest cards",
  primaryRoles: "Get Involved — primary roles",
  auStates: "Get Involved — AU states",
  membersPage: "Members page hero",
};

function inputCls() {
  return "w-full rounded-xl border border-white/10 bg-bg px-3 py-2 text-sm text-text";
}

export function SiteSettingsEditor({ initialSite, saveSiteSection }: Props) {
  const [site, setSite] = useState<SiteContent>(initialSite);
  const [active, setActive] = useState<SiteSectionKey>("hero");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const keys = useMemo(() => Object.keys(SECTION_LABELS) as SiteSectionKey[], []);

  function save() {
    setStatus(null);
    startTransition(async () => {
      try {
        await saveSiteSection(active, JSON.stringify(site[active]));
        setStatus({ type: "success", message: `Saved ${SECTION_LABELS[active]}.` });
      } catch (e) {
        setStatus({ type: "error", message: (e as Error).message });
      }
    });
  }

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-panel/40 p-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-text">Site-wide content</h2>
        <p className="mt-1 text-sm text-muted">Hero, CTAs, footer, and Get Involved form configuration.</p>
      </div>

      {status ? (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            status.type === "success"
              ? "border-green/30 bg-green/10 text-green"
              : "border-red-400/40 bg-red-500/10 text-red-200"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[220px,1fr]">
        <aside className="soft-panel h-fit rounded-2xl p-3">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Sections</p>
          <div className="space-y-1">
            {keys.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setActive(k)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  active === k
                    ? "border-green/30 bg-green/10 text-green"
                    : "border-white/10 bg-panel2/20 text-muted hover:border-white/20 hover:text-text"
                }`}
              >
                {SECTION_LABELS[k]}
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <SiteSectionFields site={site} active={active} setSite={setSite} />
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="rounded-xl border border-green/30 bg-green/20 px-4 py-2 text-sm font-semibold text-green transition hover:bg-green/30 disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save section"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SiteSectionFields({
  site,
  active,
  setSite,
}: {
  site: SiteContent;
  active: SiteSectionKey;
  setSite: React.Dispatch<React.SetStateAction<SiteContent>>;
}) {
  if (active === "hero") {
    const h = site.hero;
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Badge">
          <input className={inputCls()} value={h.badge} onChange={(e) => setSite((s) => ({ ...s, hero: { ...s.hero, badge: e.target.value } }))} />
        </Field>
        <Field label="Headline — part 1 (before gradient)">
          <input className={inputCls()} value={h.headlineL1Prefix} onChange={(e) => setSite((s) => ({ ...s, hero: { ...s.hero, headlineL1Prefix: e.target.value } }))} />
        </Field>
        <Field label="Headline — gradient word (line 1)">
          <input className={inputCls()} value={h.headlineL1Highlight} onChange={(e) => setSite((s) => ({ ...s, hero: { ...s.hero, headlineL1Highlight: e.target.value } }))} />
        </Field>
        <Field label="Headline — gradient word (line 2)">
          <input className={inputCls()} value={h.headlineL2Highlight} onChange={(e) => setSite((s) => ({ ...s, hero: { ...s.hero, headlineL2Highlight: e.target.value } }))} />
        </Field>
        <Field label="Headline — suffix (after line 2)">
          <input className={inputCls()} value={h.headlineL2Suffix} onChange={(e) => setSite((s) => ({ ...s, hero: { ...s.hero, headlineL2Suffix: e.target.value } }))} />
        </Field>
        <Field label="Subtext" className="sm:col-span-2">
          <textarea className={`${inputCls()} min-h-24`} value={h.subtext} onChange={(e) => setSite((s) => ({ ...s, hero: { ...s.hero, subtext: e.target.value } }))} />
        </Field>
        <Field label="Primary button label">
          <input className={inputCls()} value={h.primaryButtonLabel} onChange={(e) => setSite((s) => ({ ...s, hero: { ...s.hero, primaryButtonLabel: e.target.value } }))} />
        </Field>
        <Field label="Primary button href">
          <input className={inputCls()} value={h.primaryHref} onChange={(e) => setSite((s) => ({ ...s, hero: { ...s.hero, primaryHref: e.target.value } }))} />
        </Field>
        <Field label="Secondary button label">
          <input className={inputCls()} value={h.secondaryButtonLabel} onChange={(e) => setSite((s) => ({ ...s, hero: { ...s.hero, secondaryButtonLabel: e.target.value } }))} />
        </Field>
        <Field label="Secondary button href">
          <input className={inputCls()} value={h.secondaryHref} onChange={(e) => setSite((s) => ({ ...s, hero: { ...s.hero, secondaryHref: e.target.value } }))} />
        </Field>
      </div>
    );
  }

  if (active === "cta") {
    const c = site.cta;
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title line 1">
          <input className={inputCls()} value={c.titleLine1} onChange={(e) => setSite((s) => ({ ...s, cta: { ...s.cta, titleLine1: e.target.value } }))} />
        </Field>
        <Field label="Title line 2">
          <input className={inputCls()} value={c.titleLine2} onChange={(e) => setSite((s) => ({ ...s, cta: { ...s.cta, titleLine2: e.target.value } }))} />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <textarea className={`${inputCls()} min-h-20`} value={c.description} onChange={(e) => setSite((s) => ({ ...s, cta: { ...s.cta, description: e.target.value } }))} />
        </Field>
        <Field label="Telegram URL">
          <input className={inputCls()} value={c.telegramUrl} onChange={(e) => setSite((s) => ({ ...s, cta: { ...s.cta, telegramUrl: e.target.value } }))} />
        </Field>
        <Field label="Discord URL">
          <input className={inputCls()} value={c.discordUrl} onChange={(e) => setSite((s) => ({ ...s, cta: { ...s.cta, discordUrl: e.target.value } }))} />
        </Field>
        <Field label="Twitter / X URL">
          <input className={inputCls()} value={c.twitterUrl} onChange={(e) => setSite((s) => ({ ...s, cta: { ...s.cta, twitterUrl: e.target.value } }))} />
        </Field>
      </div>
    );
  }

  if (active === "footerMeta") {
    const m = site.footerMeta;
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Brand name">
          <input className={inputCls()} value={m.brandName} onChange={(e) => setSite((s) => ({ ...s, footerMeta: { ...s.footerMeta, brandName: e.target.value } }))} />
        </Field>
        <Field label="Copyright year">
          <input className={inputCls()} value={m.copyrightYear} onChange={(e) => setSite((s) => ({ ...s, footerMeta: { ...s.footerMeta, copyrightYear: e.target.value } }))} />
        </Field>
        <Field label="Tagline (default footer)" className="sm:col-span-2">
          <textarea className={`${inputCls()} min-h-16`} value={m.taglineDefault} onChange={(e) => setSite((s) => ({ ...s, footerMeta: { ...s.footerMeta, taglineDefault: e.target.value } }))} />
        </Field>
        <Field label="Tagline (Get Involved footer)" className="sm:col-span-2">
          <textarea className={`${inputCls()} min-h-16`} value={m.taglineGetInvolved} onChange={(e) => setSite((s) => ({ ...s, footerMeta: { ...s.footerMeta, taglineGetInvolved: e.target.value } }))} />
        </Field>
      </div>
    );
  }

  if (active === "getInvolvedPage") {
    const p = site.getInvolvedPage;
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Join badge">
          <input className={inputCls()} value={p.joinBadge} onChange={(e) => setSite((s) => ({ ...s, getInvolvedPage: { ...s.getInvolvedPage, joinBadge: e.target.value } }))} />
        </Field>
        <Field label="Title — prefix (before gradient)">
          <input className={inputCls()} value={p.joinTitlePrefix} onChange={(e) => setSite((s) => ({ ...s, getInvolvedPage: { ...s.getInvolvedPage, joinTitlePrefix: e.target.value } }))} />
        </Field>
        <Field label="Title — gradient word">
          <input className={inputCls()} value={p.joinTitleGradient} onChange={(e) => setSite((s) => ({ ...s, getInvolvedPage: { ...s.getInvolvedPage, joinTitleGradient: e.target.value } }))} />
        </Field>
        <Field label="Page subtitle" className="sm:col-span-2">
          <textarea className={`${inputCls()} min-h-24`} value={p.pageSubtitle} onChange={(e) => setSite((s) => ({ ...s, getInvolvedPage: { ...s.getInvolvedPage, pageSubtitle: e.target.value } }))} />
        </Field>
        <Field label="Perk title">
          <input className={inputCls()} value={p.perkTitle} onChange={(e) => setSite((s) => ({ ...s, getInvolvedPage: { ...s.getInvolvedPage, perkTitle: e.target.value } }))} />
        </Field>
        <Field label="Perk body" className="sm:col-span-2">
          <textarea className={`${inputCls()} min-h-20`} value={p.perkBody} onChange={(e) => setSite((s) => ({ ...s, getInvolvedPage: { ...s.getInvolvedPage, perkBody: e.target.value } }))} />
        </Field>
        <Field label="Privacy note" className="sm:col-span-2">
          <textarea className={`${inputCls()} min-h-16`} value={p.privacyNote} onChange={(e) => setSite((s) => ({ ...s, getInvolvedPage: { ...s.getInvolvedPage, privacyNote: e.target.value } }))} />
        </Field>
      </div>
    );
  }

  if (active === "membersPage") {
    const p = site.membersPage;
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title line — before highlight">
          <input className={inputCls()} value={p.titleBefore} onChange={(e) => setSite((s) => ({ ...s, membersPage: { ...s.membersPage, titleBefore: e.target.value } }))} />
        </Field>
        <Field label="Title — highlighted word">
          <input className={inputCls()} value={p.titleHighlight} onChange={(e) => setSite((s) => ({ ...s, membersPage: { ...s.membersPage, titleHighlight: e.target.value } }))} />
        </Field>
        <Field label="Subtitle" className="sm:col-span-2">
          <textarea className={`${inputCls()} min-h-24`} value={p.subtitle} onChange={(e) => setSite((s) => ({ ...s, membersPage: { ...s.membersPage, subtitle: e.target.value } }))} />
        </Field>
      </div>
    );
  }

  if (active === "footerLinks") {
    return (
      <EditableFooterLinks
        items={site.footerLinks}
        onChange={(next) => setSite((s) => ({ ...s, footerLinks: next }))}
      />
    );
  }

  if (active === "interestCards") {
    return (
      <EditableInterestCards
        items={site.interestCards}
        onChange={(next) => setSite((s) => ({ ...s, interestCards: next }))}
      />
    );
  }

  if (active === "primaryRoles") {
    return (
      <EditableSelectOptions
        items={site.primaryRoles}
        onChange={(next) => setSite((s) => ({ ...s, primaryRoles: next }))}
        emptyItem={{ value: "", label: "" }}
      />
    );
  }

  if (active === "auStates") {
    return (
      <EditableSelectOptions
        items={site.auStates}
        onChange={(next) => setSite((s) => ({ ...s, auStates: next }))}
        emptyItem={{ value: "", label: "" }}
      />
    );
  }

  return null;
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}

function EditableFooterLinks({
  items,
  onChange,
}: {
  items: FooterLink[];
  onChange: (next: FooterLink[]) => void;
}) {
  function patchLink<K extends keyof FooterLink>(index: number, key: K, value: FooterLink[K]) {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() =>
          onChange([...items, { id: `link-${Date.now()}`, label: "Link", href: "/", variant: "default" }])
        }
        className="rounded-xl border border-white/20 bg-white/[0.03] px-3 py-2 text-xs text-muted hover:text-text"
      >
        Add link
      </button>
      {items.map((item, index) => (
        <div key={`${item.id}-${index}`} className="space-y-2 rounded-2xl border border-white/10 bg-bg/60 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => {
                const n = [...items];
                [n[index - 1], n[index]] = [n[index], n[index - 1]];
                onChange(n);
              }}
              className="rounded-lg border border-white/15 px-2 py-1 text-xs text-muted disabled:opacity-40"
            >
              Up
            </button>
            <button
              type="button"
              disabled={index === items.length - 1}
              onClick={() => {
                const n = [...items];
                [n[index], n[index + 1]] = [n[index + 1], n[index]];
                onChange(n);
              }}
              className="rounded-lg border border-white/15 px-2 py-1 text-xs text-muted disabled:opacity-40"
            >
              Down
            </button>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="rounded-lg border border-red-300/30 px-2 py-1 text-xs text-red-300"
            >
              Remove
            </button>
          </div>
          <input className={inputCls()} value={item.id} onChange={(e) => patchLink(index, "id", e.target.value)} placeholder="id" />
          <input className={inputCls()} value={item.label} onChange={(e) => patchLink(index, "label", e.target.value)} placeholder="Label" />
          <input className={inputCls()} value={item.href} onChange={(e) => patchLink(index, "href", e.target.value)} placeholder="https://..." />
          <select
            className={inputCls()}
            value={item.variant}
            onChange={(e) => patchLink(index, "variant", e.target.value as FooterLink["variant"])}
          >
            <option value="default">Default footer</option>
            <option value="get_involved">Get Involved footer</option>
          </select>
        </div>
      ))}
    </div>
  );
}

const ICON_OPTIONS: InterestIconKey[] = ["bounties", "grants", "networking", "jobs"];

function EditableInterestCards({
  items,
  onChange,
}: {
  items: InterestCardConfig[];
  onChange: (next: InterestCardConfig[]) => void;
}) {
  function patchCard<K extends keyof InterestCardConfig>(index: number, key: K, value: InterestCardConfig[K]) {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() =>
          onChange([
            ...items,
            { id: `card-${items.length + 1}`, title: "", description: "", iconKey: "bounties" },
          ])
        }
        className="rounded-xl border border-white/20 bg-white/[0.03] px-3 py-2 text-xs text-muted hover:text-text"
      >
        Add card
      </button>
      {items.map((item, index) => (
        <div key={`${item.id}-${index}`} className="space-y-2 rounded-2xl border border-white/10 bg-bg/60 p-4">
          <input className={inputCls()} value={item.id} onChange={(e) => patchCard(index, "id", e.target.value)} placeholder="id (stable key)" />
          <input className={inputCls()} value={item.title} onChange={(e) => patchCard(index, "title", e.target.value)} placeholder="Title" />
          <textarea className={`${inputCls()} min-h-16`} value={item.description} onChange={(e) => patchCard(index, "description", e.target.value)} />
          <select
            className={inputCls()}
            value={item.iconKey}
            onChange={(e) => patchCard(index, "iconKey", e.target.value as InterestIconKey)}
          >
            {ICON_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

function EditableSelectOptions({
  items,
  onChange,
  emptyItem,
}: {
  items: SelectOption[];
  onChange: (next: SelectOption[]) => void;
  emptyItem: SelectOption;
}) {
  function patchOpt<K extends keyof SelectOption>(index: number, key: K, value: SelectOption[K]) {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => onChange([...items, { ...emptyItem }])}
        className="rounded-xl border border-white/20 bg-white/[0.03] px-3 py-2 text-xs text-muted hover:text-text"
      >
        Add row
      </button>
      {items.map((item, index) => (
        <div key={`${item.value}-${index}`} className="flex flex-col gap-2 sm:flex-row">
          <input
            className={inputCls()}
            value={item.value}
            onChange={(e) => patchOpt(index, "value", e.target.value)}
            placeholder="value (stored)"
          />
          <input
            className={inputCls()}
            value={item.label}
            onChange={(e) => patchOpt(index, "label", e.target.value)}
            placeholder="label (shown)"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="shrink-0 rounded-lg border border-red-300/30 px-2 py-2 text-xs text-red-300"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
