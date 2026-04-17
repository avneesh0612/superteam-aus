import { revalidatePath } from "next/cache";
import { loadSiteFromDatabase, saveSiteSectionToDatabase } from "@/lib/site-db";
import type { SiteContent, SiteSectionKey } from "@/lib/types";
import { createPublicSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase";

export const EMPTY_SITE_CONTENT: SiteContent = {
  hero: {
    badge: "",
    headlineL1Prefix: "",
    headlineL1Highlight: "",
    headlineL2Highlight: "",
    headlineL2Suffix: "",
    subtext: "",
    primaryButtonLabel: "",
    primaryHref: "#",
    secondaryButtonLabel: "",
    secondaryHref: "#",
  },
  cta: {
    titleLine1: "",
    titleLine2: "",
    description: "",
    telegramUrl: "#",
    discordUrl: "#",
    twitterUrl: "#",
  },
  footerMeta: {
    brandName: "",
    taglineDefault: "",
    taglineGetInvolved: "",
    copyrightYear: "",
  },
  footerLinks: [],
  getInvolvedPage: {
    joinBadge: "",
    joinTitlePrefix: "",
    joinTitleGradient: "",
    pageSubtitle: "",
    perkTitle: "",
    perkBody: "",
    privacyNote: "",
  },
  interestCards: [],
  primaryRoles: [],
  auStates: [],
  membersPage: {
    titleBefore: "",
    titleHighlight: "",
    subtitle: "",
  },
};

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return EMPTY_SITE_CONTENT;

  const loaded = await loadSiteFromDatabase(supabase);
  return loaded ?? EMPTY_SITE_CONTENT;
}

export async function upsertSiteSection(key: SiteSectionKey, value: unknown) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Missing Supabase service role credentials.");

  await saveSiteSectionToDatabase(supabase, key, value as SiteContent[SiteSectionKey]);

  revalidatePath("/");
  revalidatePath("/get-involved");
  revalidatePath("/members");
  revalidatePath("/cms");
}
