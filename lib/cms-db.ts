import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Announcement,
  CMSContent,
  CMSKey,
  EventItem,
  FAQ,
  Member,
  MissionCard,
  NavLink,
  Partner,
  Stat,
  Testimonial,
} from "@/lib/types";

/** PostgREST requires a filter on DELETE; all CMS tables use integer `sort_order`. */
const SORT_ORDER_MIN = -2147483648;

type CmsTableName =
  | "cms_nav_links"
  | "cms_stats"
  | "cms_mission_cards"
  | "cms_events"
  | "cms_members"
  | "cms_partners"
  | "cms_announcements"
  | "cms_testimonials"
  | "cms_faqs";

async function deleteAllCmsRows(supabase: SupabaseClient, table: CmsTableName) {
  const { error } = await supabase.from(table).delete().gte("sort_order", SORT_ORDER_MIN);
  if (error) throw error;
}

function parseEventStatus(value: string | null): EventItem["status"] | undefined {
  if (value === "upcoming" || value === "past") return value;
  return undefined;
}

const CMS_KEYS_ORDER: CMSKey[] = [
  "navLinks",
  "stats",
  "missionCards",
  "events",
  "members",
  "partners",
  "announcements",
  "testimonials",
  "faqs",
];

const sectionFetchers: {
  [K in CMSKey]: (supabase: SupabaseClient) => Promise<CMSContent[K] | undefined>;
} = {
  async navLinks(supabase) {
    const { data, error } = await supabase
      .from("cms_nav_links")
      .select("label, href")
      .order("sort_order", { ascending: true });
    if (error) return undefined;
    return (data ?? []).map((r) => ({ label: r.label, href: r.href }));
  },

  async stats(supabase) {
    const { data, error } = await supabase
      .from("cms_stats")
      .select("id, label, value")
      .order("sort_order", { ascending: true });
    if (error) return undefined;
    return (data ?? []).map(
      (r): Stat => ({
        id: r.id,
        label: r.label,
        value: r.value,
      })
    );
  },

  async missionCards(supabase) {
    const { data, error } = await supabase
      .from("cms_mission_cards")
      .select("id, title, description")
      .order("sort_order", { ascending: true });
    if (error) return undefined;
    return (data ?? []).map(
      (r): MissionCard => ({
        id: r.id,
        title: r.title,
        description: r.description,
      })
    );
  },

  async events(supabase) {
    const { data, error } = await supabase
      .from("cms_events")
      .select("id, title, city, date, image, luma_url, status")
      .order("sort_order", { ascending: true });
    if (error) return undefined;
    return (data ?? []).map(
      (r): EventItem => ({
        id: r.id,
        title: r.title,
        city: r.city,
        date: r.date,
        image: r.image,
        lumaUrl: r.luma_url,
        status: parseEventStatus(r.status),
      })
    );
  },

  async members(supabase) {
    const { data, error } = await supabase
      .from("cms_members")
      .select("id, name, role, company, location, photo, twitter_url, tags, badge, featured, bio")
      .order("sort_order", { ascending: true });
    if (error) return undefined;
    return (data ?? []).map(
      (r): Member => ({
        id: r.id,
        name: r.name,
        role: r.role,
        company: r.company ?? undefined,
        location: r.location ?? undefined,
        photo: r.photo,
        twitterUrl: r.twitter_url ?? undefined,
        tags: r.tags ?? [],
        badge: r.badge ?? undefined,
        featured: r.featured ?? undefined,
        bio: r.bio ?? undefined,
      })
    );
  },

  async partners(supabase) {
    const { data, error } = await supabase
      .from("cms_partners")
      .select("id, name, logo_url, website_url, project")
      .order("sort_order", { ascending: true });
    if (error) return undefined;
    return (data ?? []).map(
      (r): Partner => ({
        id: r.id,
        name: r.name,
        logoUrl: r.logo_url ?? undefined,
        websiteUrl: r.website_url ?? undefined,
        project: r.project ?? undefined,
      })
    );
  },

  async announcements(supabase) {
    const { data, error } = await supabase
      .from("cms_announcements")
      .select("id, title, summary, href, tag, date")
      .order("sort_order", { ascending: true });
    if (error) return undefined;
    return (data ?? []).map(
      (r): Announcement => ({
        id: r.id,
        title: r.title,
        summary: r.summary,
        href: r.href ?? undefined,
        tag: r.tag ?? undefined,
        date: r.date ?? undefined,
      })
    );
  },

  async testimonials(supabase) {
    const { data, error } = await supabase
      .from("cms_testimonials")
      .select("id, quote, name, title")
      .order("sort_order", { ascending: true });
    if (error) return undefined;
    return (data ?? []).map(
      (r): Testimonial => ({
        id: r.id,
        quote: r.quote,
        name: r.name,
        title: r.title,
      })
    );
  },

  async faqs(supabase) {
    const { data, error } = await supabase.from("cms_faqs").select("id, question, answer").order("sort_order", { ascending: true });
    if (error) return undefined;
    return (data ?? []).map(
      (r): FAQ => ({
        id: r.id,
        question: r.question,
        answer: r.answer,
      })
    );
  },
};

const sectionUpserters: {
  [K in CMSKey]: (supabase: SupabaseClient, value: CMSContent[K]) => Promise<void>;
} = {
  async navLinks(supabase, items) {
    await deleteAllCmsRows(supabase, "cms_nav_links");
    if (items.length === 0) return;
    const { error } = await supabase.from("cms_nav_links").insert(
      items.map((item, i) => ({
        label: item.label,
        href: item.href,
        sort_order: i,
      }))
    );
    if (error) throw error;
  },

  async stats(supabase, items) {
    await deleteAllCmsRows(supabase, "cms_stats");
    if (items.length === 0) return;
    const { error } = await supabase.from("cms_stats").insert(
      items.map((item, i) => ({
        id: item.id,
        label: item.label,
        value: item.value,
        sort_order: i,
      }))
    );
    if (error) throw error;
  },

  async missionCards(supabase, items) {
    await deleteAllCmsRows(supabase, "cms_mission_cards");
    if (items.length === 0) return;
    const { error } = await supabase.from("cms_mission_cards").insert(
      items.map((item, i) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        sort_order: i,
      }))
    );
    if (error) throw error;
  },

  async events(supabase, items) {
    await deleteAllCmsRows(supabase, "cms_events");
    if (items.length === 0) return;
    const { error } = await supabase.from("cms_events").insert(
      items.map((item, i) => ({
        id: item.id,
        title: item.title,
        city: item.city,
        date: item.date,
        image: item.image,
        luma_url: item.lumaUrl,
        status: item.status ?? null,
        sort_order: i,
      }))
    );
    if (error) throw error;
  },

  async members(supabase, items) {
    await deleteAllCmsRows(supabase, "cms_members");
    if (items.length === 0) return;
    const { error } = await supabase.from("cms_members").insert(
      items.map((item, i) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        company: item.company ?? null,
        location: item.location ?? null,
        photo: item.photo,
        twitter_url: item.twitterUrl ?? null,
        tags: item.tags ?? [],
        badge: item.badge ?? null,
        featured: item.featured ?? false,
        bio: item.bio ?? null,
        sort_order: i,
      }))
    );
    if (error) throw error;
  },

  async partners(supabase, items) {
    await deleteAllCmsRows(supabase, "cms_partners");
    if (items.length === 0) return;
    const { error } = await supabase.from("cms_partners").insert(
      items.map((item, i) => ({
        id: item.id,
        name: item.name,
        logo_url: item.logoUrl ?? null,
        website_url: item.websiteUrl ?? null,
        project: item.project ?? null,
        sort_order: i,
      }))
    );
    if (error) throw error;
  },

  async announcements(supabase, items) {
    await deleteAllCmsRows(supabase, "cms_announcements");
    if (items.length === 0) return;
    const { error } = await supabase.from("cms_announcements").insert(
      items.map((item, i) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        href: item.href ?? null,
        tag: item.tag ?? null,
        date: item.date ?? null,
        sort_order: i,
      }))
    );
    if (error) throw error;
  },

  async testimonials(supabase, items) {
    await deleteAllCmsRows(supabase, "cms_testimonials");
    if (items.length === 0) return;
    const { error } = await supabase.from("cms_testimonials").insert(
      items.map((item, i) => ({
        id: item.id,
        quote: item.quote,
        name: item.name,
        title: item.title,
        sort_order: i,
      }))
    );
    if (error) throw error;
  },

  async faqs(supabase, items) {
    await deleteAllCmsRows(supabase, "cms_faqs");
    if (items.length === 0) return;
    const { error } = await supabase.from("cms_faqs").insert(
      items.map((item, i) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        sort_order: i,
      }))
    );
    if (error) throw error;
  },
};

export async function loadCmsFromDatabase(supabase: SupabaseClient): Promise<{
  partial: Partial<CMSContent>;
  allFailed: boolean;
}> {
  const results = await Promise.all(CMS_KEYS_ORDER.map((k) => sectionFetchers[k](supabase)));

  const partial: Partial<CMSContent> = {};
  let anySuccess = false;

  CMS_KEYS_ORDER.forEach((k, i) => {
    const value = results[i];
    if (value !== undefined) {
      anySuccess = true;
      Object.assign(partial, { [k]: value } as Partial<CMSContent>);
    }
  });

  return { partial, allFailed: !anySuccess };
}

export async function saveCmsSectionToDatabase<K extends CMSKey>(supabase: SupabaseClient, key: K, value: CMSContent[K]) {
  await sectionUpserters[key](supabase, value);
}
