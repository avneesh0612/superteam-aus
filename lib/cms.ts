import { revalidatePath } from "next/cache";
import { loadCmsFromDatabase, saveCmsSectionToDatabase } from "@/lib/cms-db";
import type { CMSContent, CMSKey } from "@/lib/types";
import { createPublicSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase";

export const EMPTY_CMS_CONTENT: CMSContent = {
  navLinks: [],
  stats: [],
  missionCards: [],
  events: [],
  members: [],
  partners: [],
  announcements: [],
  testimonials: [],
  faqs: [],
};

export async function getCmsContent(): Promise<CMSContent> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return EMPTY_CMS_CONTENT;

  const { partial, allFailed } = await loadCmsFromDatabase(supabase);
  if (allFailed) return EMPTY_CMS_CONTENT;

  return { ...EMPTY_CMS_CONTENT, ...partial };
}

export async function upsertCmsContent<K extends CMSKey>(key: K, value: unknown) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Missing Supabase service role credentials.");

  await saveCmsSectionToDatabase(supabase, key, value as CMSContent[K]);

  revalidatePath("/");
  revalidatePath("/members");
  revalidatePath("/cms");
}
