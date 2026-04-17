"use client";

import { useMemo, useState, useTransition } from "react";
import { ReactNode } from "react";
import type { CMSContent, CMSKey } from "@/lib/types";

type CMSEditorProps = {
  initialContent: CMSContent;
  saveSection: (key: CMSKey, payload: string) => Promise<void>;
};

type Status = {
  type: "success" | "error";
  message: string;
};

const SECTION_LABELS: Record<CMSKey, string> = {
  navLinks: "Navigation",
  stats: "Stats",
  missionCards: "Mission Cards",
  events: "Events",
  members: "Members",
  partners: "Partners",
  announcements: "Tweets & Testimonials",
  testimonials: "Testimonials",
  faqs: "FAQs",
};

const SECTION_DESCRIPTIONS: Record<CMSKey, string> = {
  navLinks: "Top-level website navigation links.",
  stats: "Homepage KPI counters and labels.",
  missionCards: "Core value proposition cards in the mission section.",
  events: "Upcoming events with city, date, and links.",
  members: "Member directory records and featured cards.",
  partners: "Partner logos, links, and featured projects.",
  announcements: "Builder Voices feed entries (X/Twitter links and testimonial sources).",
  testimonials: "Social proof quotes on the landing page.",
  faqs: "Frequently asked questions and answers.",
};

function textInputClasses() {
  return "w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-text outline-none ring-green/30 transition focus:ring-2";
}

function isNonEmpty(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidUrl(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidAssetPath(value: unknown) {
  return typeof value === "string" && value.startsWith("/");
}

function isValidHref(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) return false;
  return isValidAssetPath(value) || isValidUrl(value);
}

function validateSection(content: CMSContent, key: CMSKey): string[] {
  const errors: string[] = [];
  if (key === "navLinks") {
    content.navLinks.forEach((item, i) => {
      if (!isNonEmpty(item.label)) errors.push(`Navigation item ${i + 1}: label is required.`);
      if (!isValidHref(item.href)) errors.push(`Navigation item ${i + 1}: href must be a path (/...) or valid URL.`);
    });
  } else if (key === "stats") {
    content.stats.forEach((item, i) => {
      if (!isNonEmpty(item.id) || !isNonEmpty(item.label) || !isNonEmpty(item.value)) {
        errors.push(`Stat ${i + 1}: id, label, and value are required.`);
      }
    });
  } else if (key === "missionCards") {
    content.missionCards.forEach((item, i) => {
      if (!isNonEmpty(item.id) || !isNonEmpty(item.title) || !isNonEmpty(item.description)) {
        errors.push(`Mission card ${i + 1}: id, title, and description are required.`);
      }
    });
  } else if (key === "events") {
    content.events.forEach((item, i) => {
      if (!isNonEmpty(item.id) || !isNonEmpty(item.title) || !isNonEmpty(item.city) || !isNonEmpty(item.date)) {
        errors.push(`Event ${i + 1}: id, title, city, and date are required.`);
      }
      if (!(isValidUrl(item.image) || isValidAssetPath(item.image))) {
        errors.push(`Event ${i + 1}: image must be a valid URL or local /public asset path.`);
      }
      if (!isValidUrl(item.lumaUrl)) errors.push(`Event ${i + 1}: luma URL must be valid.`);
      if (item.status && !["upcoming", "past"].includes(item.status)) errors.push(`Event ${i + 1}: status must be upcoming or past.`);
    });
  } else if (key === "members") {
    content.members.forEach((item, i) => {
      if (!isNonEmpty(item.id) || !isNonEmpty(item.name) || !isNonEmpty(item.role)) {
        errors.push(`Member ${i + 1}: id, name, and role are required.`);
      }
      if (!(isValidUrl(item.photo) || isValidAssetPath(item.photo))) {
        errors.push(`Member ${i + 1}: photo must be a valid URL or local /public asset path.`);
      }
      if (item.twitterUrl && !isValidUrl(item.twitterUrl)) errors.push(`Member ${i + 1}: twitter URL must be valid.`);
    });
  } else if (key === "partners") {
    content.partners.forEach((item, i) => {
      if (!isNonEmpty(item.id) || !isNonEmpty(item.name)) errors.push(`Partner ${i + 1}: id and name are required.`);
      if (item.logoUrl && !(isValidUrl(item.logoUrl) || isValidAssetPath(item.logoUrl))) {
        errors.push(`Partner ${i + 1}: logo URL must be a valid URL or local /public asset path.`);
      }
      if (item.websiteUrl && !isValidUrl(item.websiteUrl)) errors.push(`Partner ${i + 1}: website URL must be valid.`);
    });
  } else if (key === "announcements") {
    content.announcements.forEach((item, i) => {
      if (!isNonEmpty(item.id) || !isNonEmpty(item.title) || !isNonEmpty(item.summary)) {
        errors.push(`Tweets/Testimonial item ${i + 1}: id, title, and summary are required.`);
      }
      if (item.href && !isValidUrl(item.href)) errors.push(`Tweets/Testimonial item ${i + 1}: href must be valid.`);
    });
  } else if (key === "testimonials") {
    content.testimonials.forEach((item, i) => {
      if (!isNonEmpty(item.id) || !isNonEmpty(item.name) || !isNonEmpty(item.title) || !isNonEmpty(item.quote)) {
        errors.push(`Testimonial ${i + 1}: id, name, title, and quote are required.`);
      }
    });
  } else if (key === "faqs") {
    content.faqs.forEach((item, i) => {
      if (!isNonEmpty(item.id) || !isNonEmpty(item.question) || !isNonEmpty(item.answer)) {
        errors.push(`FAQ ${i + 1}: id, question, and answer are required.`);
      }
    });
  }
  return errors;
}

export function CMSEditor({ initialContent, saveSection }: CMSEditorProps) {
  const [content, setContent] = useState<CMSContent>(initialContent);
  const [status, setStatus] = useState<Status | null>(null);
  const [activeKey, setActiveKey] = useState<CMSKey>("navLinks");
  const [advancedMode, setAdvancedMode] = useState<Record<CMSKey, boolean>>({
    navLinks: false,
    stats: false,
    missionCards: false,
    events: false,
    members: false,
    partners: false,
    announcements: false,
    testimonials: false,
    faqs: false,
  });
  const [isPending, startTransition] = useTransition();

  const keys = useMemo(() => Object.keys(SECTION_LABELS) as CMSKey[], []);

  function updateSection<T>(key: CMSKey, next: T[]) {
    setContent((prev) => ({ ...prev, [key]: next }));
  }

  function save(key: CMSKey) {
    const errors = validateSection(content, key);
    if (errors.length > 0) {
      setStatus({ type: "error", message: errors.slice(0, 3).join(" ") });
      return;
    }

    setStatus(null);
    startTransition(async () => {
      try {
        await saveSection(key, JSON.stringify(content[key]));
        setStatus({ type: "success", message: `Saved ${SECTION_LABELS[key]} successfully.` });
      } catch (error) {
        setStatus({ type: "error", message: `Failed to save ${SECTION_LABELS[key]}: ${(error as Error).message}` });
      }
    });
  }

  function toggleAdvanced(key: CMSKey) {
    setAdvancedMode((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="space-y-6">
      {status ? (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            status.type === "success" ? "border-green/30 bg-green/10 text-green" : "border-red-400/40 bg-red-500/10 text-red-200"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
        <aside className="h-fit rounded-3xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4 backdrop-blur-md">
          <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Content Sections</p>
          <div className="space-y-2">
            {keys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveKey(key)}
                className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                  activeKey === key
                    ? "border-green/30 bg-green/10 text-green"
                    : "border-white/[0.06] bg-white/[0.015] text-muted hover:border-white/[0.14] hover:text-text"
                }`}
              >
                <div className="font-semibold">{SECTION_LABELS[key]}</div>
                <div className="mt-0.5 text-xs text-muted">{(content[key] as unknown[]).length} items</div>
              </button>
            ))}
          </div>
        </aside>

        <div className="rounded-3xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-6 backdrop-blur-md">
          <div className="mb-5 flex flex-col gap-4 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl">{SECTION_LABELS[activeKey]}</h2>
              <p className="mt-1 text-sm text-muted">{SECTION_DESCRIPTIONS[activeKey]}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleAdvanced(activeKey)}
                className="rounded-xl border border-white/[0.1] bg-white/[0.02] px-3 py-2 text-xs text-muted transition hover:border-white/[0.16] hover:text-text"
              >
                {advancedMode[activeKey] ? "Use form editor" : "Advanced JSON"}
              </button>
              <button
                type="button"
                onClick={() => save(activeKey)}
                disabled={isPending}
                className="rounded-xl border border-green/30 bg-green/20 px-4 py-2 text-sm font-semibold text-green transition hover:bg-green/30 disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Save Section"}
              </button>
            </div>
          </div>

          {advancedMode[activeKey] ? (
            <textarea
              className="h-[28rem] w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 font-mono text-xs text-white/90 outline-none ring-green/35 transition focus:ring-2"
              value={JSON.stringify(content[activeKey], null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setContent((prev) => ({ ...prev, [activeKey]: parsed }));
                } catch {
                  return;
                }
              }}
            />
          ) : (
            <SectionForm content={content} activeKey={activeKey} onUpdate={updateSection} />
          )}
        </div>
      </div>
    </div>
  );
}

function SectionForm({
  content,
  activeKey,
  onUpdate,
}: {
  content: CMSContent;
  activeKey: CMSKey;
  onUpdate: <T>(key: CMSKey, next: T[]) => void;
}) {
  if (activeKey === "navLinks") {
    return (
      <EditableList
        items={content.navLinks}
        emptyItem={{ label: "", href: "/" }}
        onChange={(next) => onUpdate("navLinks", next)}
        renderItem={(item, onField) => (
          <>
            <label className="text-xs text-muted">Label</label>
            <input className={textInputClasses()} value={item.label} onChange={(e) => onField("label", e.target.value)} />
            <label className="text-xs text-muted">Href</label>
            <input className={textInputClasses()} value={item.href} onChange={(e) => onField("href", e.target.value)} />
          </>
        )}
      />
    );
  }

  if (activeKey === "stats") {
    return (
      <EditableList
        items={content.stats}
        emptyItem={{ id: "", label: "", value: "" }}
        onChange={(next) => onUpdate("stats", next)}
        renderItem={(item, onField) => (
          <>
            <label className="text-xs text-muted">ID</label>
            <input className={textInputClasses()} value={item.id} onChange={(e) => onField("id", e.target.value)} />
            <label className="text-xs text-muted">Label</label>
            <input className={textInputClasses()} value={item.label} onChange={(e) => onField("label", e.target.value)} />
            <label className="text-xs text-muted">Value</label>
            <input className={textInputClasses()} value={item.value} onChange={(e) => onField("value", e.target.value)} />
          </>
        )}
      />
    );
  }

  if (activeKey === "missionCards") {
    return (
      <EditableList
        items={content.missionCards}
        emptyItem={{ id: "", title: "", description: "" }}
        onChange={(next) => onUpdate("missionCards", next)}
        renderItem={(item, onField) => (
          <>
            <label className="text-xs text-muted">ID</label>
            <input className={textInputClasses()} value={item.id} onChange={(e) => onField("id", e.target.value)} />
            <label className="text-xs text-muted">Title</label>
            <input className={textInputClasses()} value={item.title} onChange={(e) => onField("title", e.target.value)} />
            <label className="text-xs text-muted">Description</label>
            <textarea className={`${textInputClasses()} min-h-24`} value={item.description} onChange={(e) => onField("description", e.target.value)} />
          </>
        )}
      />
    );
  }

  if (activeKey === "events") {
    return (
      <EditableList
        items={content.events}
        emptyItem={{ id: "", title: "", city: "", date: "", image: "", lumaUrl: "", status: "upcoming" }}
        onChange={(next) => onUpdate("events", next)}
        renderItem={(item, onField) => (
          <>
            <label className="text-xs text-muted">ID</label>
            <input className={textInputClasses()} value={item.id} onChange={(e) => onField("id", e.target.value)} />
            <label className="text-xs text-muted">Title</label>
            <input className={textInputClasses()} value={item.title} onChange={(e) => onField("title", e.target.value)} />
            <label className="text-xs text-muted">City</label>
            <input className={textInputClasses()} value={item.city} onChange={(e) => onField("city", e.target.value)} />
            <label className="text-xs text-muted">Date</label>
            <input className={textInputClasses()} value={item.date} onChange={(e) => onField("date", e.target.value)} />
            <label className="text-xs text-muted">Status (upcoming/past)</label>
            <input className={textInputClasses()} value={item.status || "upcoming"} onChange={(e) => onField("status", e.target.value)} />
            <label className="text-xs text-muted">Image URL</label>
            <input className={textInputClasses()} value={item.image} onChange={(e) => onField("image", e.target.value)} />
            <ImagePreview url={item.image} alt={item.title || "Event preview"} />
            <label className="text-xs text-muted">Luma URL</label>
            <input className={textInputClasses()} value={item.lumaUrl} onChange={(e) => onField("lumaUrl", e.target.value)} />
          </>
        )}
      />
    );
  }

  if (activeKey === "members") {
    return (
      <EditableList
        items={content.members}
        emptyItem={{ id: "", name: "", role: "", company: "", location: "", photo: "", twitterUrl: "", tags: [], badge: "", featured: false, bio: "" }}
        onChange={(next) => onUpdate("members", next)}
        renderItem={(item, onField) => (
          <>
            <label className="text-xs text-muted">ID</label>
            <input className={textInputClasses()} value={item.id} onChange={(e) => onField("id", e.target.value)} />
            <label className="text-xs text-muted">Name</label>
            <input className={textInputClasses()} value={item.name} onChange={(e) => onField("name", e.target.value)} />
            <label className="text-xs text-muted">Role</label>
            <input className={textInputClasses()} value={item.role} onChange={(e) => onField("role", e.target.value)} />
            <label className="text-xs text-muted">Company</label>
            <input className={textInputClasses()} value={item.company || ""} onChange={(e) => onField("company", e.target.value)} />
            <label className="text-xs text-muted">Location</label>
            <input className={textInputClasses()} value={item.location || ""} onChange={(e) => onField("location", e.target.value)} />
            <label className="text-xs text-muted">Photo URL</label>
            <input className={textInputClasses()} value={item.photo} onChange={(e) => onField("photo", e.target.value)} />
            <ImagePreview url={item.photo} alt={item.name || "Member preview"} />
            <label className="text-xs text-muted">Twitter URL</label>
            <input className={textInputClasses()} value={item.twitterUrl || ""} onChange={(e) => onField("twitterUrl", e.target.value)} />
            <label className="text-xs text-muted">Badge</label>
            <input className={textInputClasses()} value={item.badge || ""} onChange={(e) => onField("badge", e.target.value)} />
            <label className="text-xs text-muted">Tags (comma separated)</label>
            <input
              className={textInputClasses()}
              value={item.tags.join(", ")}
              onChange={(e) =>
                onField(
                  "tags",
                  e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                )
              }
            />
            <label className="text-xs text-muted">Bio</label>
            <textarea className={`${textInputClasses()} min-h-24`} value={item.bio || ""} onChange={(e) => onField("bio", e.target.value)} />
            <label className="mt-1 flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={Boolean(item.featured)}
                onChange={(e) => onField("featured", e.target.checked)}
              />
              Featured
            </label>
          </>
        )}
      />
    );
  }

  if (activeKey === "partners") {
    return (
      <EditableList
        items={content.partners}
        emptyItem={{ id: "", name: "", logoUrl: "", websiteUrl: "", project: "" }}
        onChange={(next) => onUpdate("partners", next)}
        renderItem={(item, onField) => (
          <>
            <label className="text-xs text-muted">ID</label>
            <input className={textInputClasses()} value={item.id} onChange={(e) => onField("id", e.target.value)} />
            <label className="text-xs text-muted">Name</label>
            <input className={textInputClasses()} value={item.name} onChange={(e) => onField("name", e.target.value)} />
            <label className="text-xs text-muted">Logo URL</label>
            <input className={textInputClasses()} value={item.logoUrl || ""} onChange={(e) => onField("logoUrl", e.target.value)} />
            <ImagePreview url={item.logoUrl} alt={item.name || "Partner logo preview"} />
            <label className="text-xs text-muted">Website URL</label>
            <input className={textInputClasses()} value={item.websiteUrl || ""} onChange={(e) => onField("websiteUrl", e.target.value)} />
            <label className="text-xs text-muted">Project</label>
            <input className={textInputClasses()} value={item.project || ""} onChange={(e) => onField("project", e.target.value)} />
          </>
        )}
      />
    );
  }

  if (activeKey === "announcements") {
    return (
      <EditableList
        items={content.announcements}
        emptyItem={{ id: "", title: "", summary: "", href: "", tag: "", date: "" }}
        onChange={(next) => onUpdate("announcements", next)}
        renderItem={(item, onField) => (
          <>
            <label className="text-xs text-muted">ID</label>
            <input className={textInputClasses()} value={item.id} onChange={(e) => onField("id", e.target.value)} />
            <label className="text-xs text-muted">Title</label>
            <input className={textInputClasses()} value={item.title} onChange={(e) => onField("title", e.target.value)} />
            <label className="text-xs text-muted">Summary</label>
            <textarea className={`${textInputClasses()} min-h-24`} value={item.summary} onChange={(e) => onField("summary", e.target.value)} />
            <label className="text-xs text-muted">Href</label>
            <input className={textInputClasses()} value={item.href || ""} onChange={(e) => onField("href", e.target.value)} />
            <label className="text-xs text-muted">Tag</label>
            <input className={textInputClasses()} value={item.tag || ""} onChange={(e) => onField("tag", e.target.value)} />
            <label className="text-xs text-muted">Date</label>
            <input className={textInputClasses()} value={item.date || ""} onChange={(e) => onField("date", e.target.value)} />
          </>
        )}
      />
    );
  }

  if (activeKey === "testimonials") {
    return (
      <EditableList
        items={content.testimonials}
        emptyItem={{ id: "", quote: "", name: "", title: "" }}
        onChange={(next) => onUpdate("testimonials", next)}
        renderItem={(item, onField) => (
          <>
            <label className="text-xs text-muted">ID</label>
            <input className={textInputClasses()} value={item.id} onChange={(e) => onField("id", e.target.value)} />
            <label className="text-xs text-muted">Name</label>
            <input className={textInputClasses()} value={item.name} onChange={(e) => onField("name", e.target.value)} />
            <label className="text-xs text-muted">Title</label>
            <input className={textInputClasses()} value={item.title} onChange={(e) => onField("title", e.target.value)} />
            <label className="text-xs text-muted">Quote</label>
            <textarea className={`${textInputClasses()} min-h-24`} value={item.quote} onChange={(e) => onField("quote", e.target.value)} />
          </>
        )}
      />
    );
  }

  return (
    <EditableList
      items={content.faqs}
      emptyItem={{ id: "", question: "", answer: "" }}
      onChange={(next) => onUpdate("faqs", next)}
      renderItem={(item, onField) => (
        <>
          <label className="text-xs text-muted">ID</label>
          <input className={textInputClasses()} value={item.id} onChange={(e) => onField("id", e.target.value)} />
          <label className="text-xs text-muted">Question</label>
          <input className={textInputClasses()} value={item.question} onChange={(e) => onField("question", e.target.value)} />
          <label className="text-xs text-muted">Answer</label>
          <textarea className={`${textInputClasses()} min-h-24`} value={item.answer} onChange={(e) => onField("answer", e.target.value)} />
        </>
      )}
    />
  );
}

function EditableList<T extends Record<string, unknown>>({
  items,
  emptyItem,
  onChange,
  renderItem,
}: {
  items: T[];
  emptyItem: T;
  onChange: (next: T[]) => void;
  renderItem: (item: T, onField: (field: keyof T, value: unknown) => void) => ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onChange([...items, structuredClone(emptyItem)])}
          className="rounded-xl border border-white/[0.1] bg-white/[0.02] px-4 py-2 text-sm text-muted transition hover:border-white/[0.16] hover:text-text"
        >
          Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-muted">No items yet.</div>
      ) : null}

      {items.map((item, index) => (
        <div key={`${String(item.id ?? index)}-${index}`} className="space-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted">Item {index + 1}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => {
                  const next = [...items];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  onChange(next);
                }}
                className="rounded-lg border border-white/[0.1] px-2 py-1 text-xs text-muted transition hover:border-white/[0.16] hover:text-text disabled:opacity-40"
              >
                Move Up
              </button>
              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() => {
                  const next = [...items];
                  [next[index], next[index + 1]] = [next[index + 1], next[index]];
                  onChange(next);
                }}
                className="rounded-lg border border-white/[0.1] px-2 py-1 text-xs text-muted transition hover:border-white/[0.16] hover:text-text disabled:opacity-40"
              >
                Move Down
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="rounded-lg border border-red-300/30 bg-red-500/[0.04] px-2 py-1 text-xs text-red-300 transition hover:border-red-300/45 hover:text-red-200"
              >
                Remove
              </button>
            </div>
          </div>
          {renderItem(item, (field, value) => {
            const next = [...items];
            next[index] = { ...item, [field]: value };
            onChange(next);
          })}
        </div>
      ))}
    </div>
  );
}

function ImagePreview({ url, alt }: { url: unknown; alt: string }) {
  if (!isValidUrl(url)) return null;
  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.015]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url as string} alt={alt} className="h-36 w-full object-cover" />
    </div>
  );
}
