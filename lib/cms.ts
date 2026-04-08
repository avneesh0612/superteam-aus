import { revalidatePath } from "next/cache";
import {
  announcements,
  events,
  faqs,
  members,
  missionCards,
  navLinks,
  partners,
  stats,
  testimonials,
} from "@/lib/data";
import { CMSContent } from "@/lib/types";
import { createPublicSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase";

type CMSKey = keyof CMSContent;

const DEFAULT_CONTENT: CMSContent = {
  navLinks,
  stats,
  missionCards,
  events,
  members,
  partners,
  announcements,
  testimonials,
  faqs,
};

export async function getCmsContent(): Promise<CMSContent> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return DEFAULT_CONTENT;

  const { data, error } = await supabase.from("cms_content").select("key, value");
  if (error || !data) return DEFAULT_CONTENT;

  const fromDb = data.reduce((acc, row) => {
    const key = row.key as CMSKey;
    if (key in DEFAULT_CONTENT) {
      acc[key] = row.value as never;
    }
    return acc;
  }, {} as Partial<CMSContent>);

  return { ...DEFAULT_CONTENT, ...fromDb };
}

export async function upsertCmsContent(key: CMSKey, value: unknown) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Missing Supabase service role credentials.");

  const { error } = await supabase
    .from("cms_content")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/members");
  revalidatePath("/cms");
}
