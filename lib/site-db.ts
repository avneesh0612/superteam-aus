import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CtaContent,
  FooterLink,
  FooterMeta,
  GetInvolvedPageCopy,
  HeroContent,
  InterestCardConfig,
  InterestIconKey,
  MembersPageCopy,
  SelectOption,
  SiteContent,
  SiteSectionKey,
} from "@/lib/types";

const SORT_ORDER_MIN = -2147483648;

type CmsListTable = "cms_footer_links" | "cms_interest_cards";

async function deleteSingleton(
  supabase: SupabaseClient,
  table: "cms_hero" | "cms_cta" | "cms_footer_meta" | "cms_get_involved_page" | "cms_members_page"
) {
  const { error } = await supabase.from(table).delete().eq("id", 1);
  if (error) throw error;
}

async function deleteAllListRows(supabase: SupabaseClient, table: CmsListTable) {
  const { error } = await supabase.from(table).delete().gte("sort_order", SORT_ORDER_MIN);
  if (error) throw error;
}

function mapHeroRow(r: {
  badge: string;
  headline_l1_prefix: string;
  headline_l1_highlight: string;
  headline_l2_highlight: string;
  headline_l2_suffix: string;
  subtext: string;
  primary_button_label: string;
  primary_href: string;
  secondary_button_label: string;
  secondary_href: string;
}): HeroContent {
  return {
    badge: r.badge,
    headlineL1Prefix: r.headline_l1_prefix,
    headlineL1Highlight: r.headline_l1_highlight,
    headlineL2Highlight: r.headline_l2_highlight,
    headlineL2Suffix: r.headline_l2_suffix,
    subtext: r.subtext,
    primaryButtonLabel: r.primary_button_label,
    primaryHref: r.primary_href,
    secondaryButtonLabel: r.secondary_button_label,
    secondaryHref: r.secondary_href,
  };
}

export async function loadSiteFromDatabase(supabase: SupabaseClient): Promise<SiteContent | null> {
  const [
    heroRes,
    ctaRes,
    metaRes,
    giRes,
    linksRes,
    cardsRes,
    rolesRes,
    statesRes,
    membersPageRes,
  ] = await Promise.all([
    supabase.from("cms_hero").select("*").eq("id", 1).maybeSingle(),
    supabase.from("cms_cta").select("*").eq("id", 1).maybeSingle(),
    supabase.from("cms_footer_meta").select("*").eq("id", 1).maybeSingle(),
    supabase.from("cms_get_involved_page").select("*").eq("id", 1).maybeSingle(),
    supabase.from("cms_footer_links").select("*").order("sort_order", { ascending: true }),
    supabase.from("cms_interest_cards").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("cms_select_options")
      .select("value, label")
      .eq("category", "primary_role")
      .order("sort_order", { ascending: true }),
    supabase
      .from("cms_select_options")
      .select("value, label")
      .eq("category", "au_state")
      .order("sort_order", { ascending: true }),
    supabase.from("cms_members_page").select("*").eq("id", 1).maybeSingle(),
  ]);

  if (
    heroRes.error ||
    ctaRes.error ||
    metaRes.error ||
    giRes.error ||
    linksRes.error ||
    cardsRes.error ||
    rolesRes.error ||
    statesRes.error ||
    membersPageRes.error
  ) {
    return null;
  }

  if (!heroRes.data || !ctaRes.data || !metaRes.data || !giRes.data) {
    return null;
  }

  const hero = mapHeroRow(heroRes.data as Parameters<typeof mapHeroRow>[0]);

  const c: CtaContent = {
    titleLine1: ctaRes.data.title_line1,
    titleLine2: ctaRes.data.title_line2,
    description: ctaRes.data.description,
    telegramUrl: ctaRes.data.telegram_url,
    discordUrl: ctaRes.data.discord_url,
    twitterUrl: ctaRes.data.twitter_url,
  };

  const footerMeta: FooterMeta = {
    brandName: metaRes.data.brand_name,
    taglineDefault: metaRes.data.tagline_default,
    taglineGetInvolved: metaRes.data.tagline_get_involved,
    copyrightYear: metaRes.data.copyright_year,
  };

  const gi = giRes.data as {
    page_subtitle: string;
    perk_title: string;
    perk_body: string;
    privacy_note: string;
    join_badge?: string;
    join_title_prefix?: string;
    join_title_gradient?: string;
  };

  const getInvolvedPage: GetInvolvedPageCopy = {
    joinBadge: gi.join_badge ?? "",
    joinTitlePrefix: gi.join_title_prefix ?? "",
    joinTitleGradient: gi.join_title_gradient ?? "",
    pageSubtitle: gi.page_subtitle,
    perkTitle: gi.perk_title,
    perkBody: gi.perk_body,
    privacyNote: gi.privacy_note,
  };

  const footerLinks: FooterLink[] = (linksRes.data ?? []).map((r) => ({
    id: r.id,
    label: r.label,
    href: r.href,
    variant: r.variant as FooterLink["variant"],
  }));

  const interestCards: InterestCardConfig[] = (cardsRes.data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    iconKey: r.icon_key as InterestIconKey,
  }));

  const primaryRoles: SelectOption[] = (rolesRes.data ?? []).map((r) => ({
    value: r.value,
    label: r.label,
  }));

  const auStates: SelectOption[] = (statesRes.data ?? []).map((r) => ({
    value: r.value,
    label: r.label,
  }));

  const membersPage: MembersPageCopy = membersPageRes.data
    ? {
        titleBefore: membersPageRes.data.title_before,
        titleHighlight: membersPageRes.data.title_highlight,
        subtitle: membersPageRes.data.subtitle,
      }
    : { titleBefore: "", titleHighlight: "", subtitle: "" };

  return {
    hero,
    cta: c,
    footerMeta,
    footerLinks,
    getInvolvedPage,
    interestCards,
    primaryRoles,
    auStates,
    membersPage,
  };
}

export async function saveSiteSectionToDatabase(
  supabase: SupabaseClient,
  key: SiteSectionKey,
  value: SiteContent[SiteSectionKey]
) {
  switch (key) {
    case "hero": {
      const h = value as HeroContent;
      await deleteSingleton(supabase, "cms_hero");
      const { error } = await supabase.from("cms_hero").insert({
        id: 1,
        badge: h.badge,
        headline_l1_prefix: h.headlineL1Prefix,
        headline_l1_highlight: h.headlineL1Highlight,
        headline_l2_highlight: h.headlineL2Highlight,
        headline_l2_suffix: h.headlineL2Suffix,
        subtext: h.subtext,
        primary_button_label: h.primaryButtonLabel,
        primary_href: h.primaryHref,
        secondary_button_label: h.secondaryButtonLabel,
        secondary_href: h.secondaryHref,
      });
      if (error) throw error;
      break;
    }
    case "cta": {
      const c = value as CtaContent;
      await deleteSingleton(supabase, "cms_cta");
      const { error } = await supabase.from("cms_cta").insert({
        id: 1,
        title_line1: c.titleLine1,
        title_line2: c.titleLine2,
        description: c.description,
        telegram_url: c.telegramUrl,
        discord_url: c.discordUrl,
        twitter_url: c.twitterUrl,
      });
      if (error) throw error;
      break;
    }
    case "footerMeta": {
      const m = value as FooterMeta;
      await deleteSingleton(supabase, "cms_footer_meta");
      const { error } = await supabase.from("cms_footer_meta").insert({
        id: 1,
        brand_name: m.brandName,
        tagline_default: m.taglineDefault,
        tagline_get_involved: m.taglineGetInvolved,
        copyright_year: m.copyrightYear,
      });
      if (error) throw error;
      break;
    }
    case "getInvolvedPage": {
      const p = value as GetInvolvedPageCopy;
      await deleteSingleton(supabase, "cms_get_involved_page");
      const { error } = await supabase.from("cms_get_involved_page").insert({
        id: 1,
        join_badge: p.joinBadge,
        join_title_prefix: p.joinTitlePrefix,
        join_title_gradient: p.joinTitleGradient,
        page_subtitle: p.pageSubtitle,
        perk_title: p.perkTitle,
        perk_body: p.perkBody,
        privacy_note: p.privacyNote,
      });
      if (error) throw error;
      break;
    }
    case "footerLinks": {
      const links = value as FooterLink[];
      await deleteAllListRows(supabase, "cms_footer_links");
      if (links.length > 0) {
        const { error } = await supabase.from("cms_footer_links").insert(
          links.map((item, i) => ({
            id: item.id,
            label: item.label,
            href: item.href,
            variant: item.variant,
            sort_order: i,
          }))
        );
        if (error) throw error;
      }
      break;
    }
    case "interestCards": {
      const cards = value as InterestCardConfig[];
      await deleteAllListRows(supabase, "cms_interest_cards");
      if (cards.length > 0) {
        const { error } = await supabase.from("cms_interest_cards").insert(
          cards.map((item, i) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            icon_key: item.iconKey,
            sort_order: i,
          }))
        );
        if (error) throw error;
      }
      break;
    }
    case "primaryRoles": {
      const opts = value as SelectOption[];
      const { error: delErr } = await supabase.from("cms_select_options").delete().eq("category", "primary_role");
      if (delErr) throw delErr;
      if (opts.length > 0) {
        const { error } = await supabase.from("cms_select_options").insert(
          opts.map((o, i) => ({
            category: "primary_role" as const,
            value: o.value,
            label: o.label,
            sort_order: i,
          }))
        );
        if (error) throw error;
      }
      break;
    }
    case "auStates": {
      const opts = value as SelectOption[];
      const { error: delErr } = await supabase.from("cms_select_options").delete().eq("category", "au_state");
      if (delErr) throw delErr;
      if (opts.length > 0) {
        const { error } = await supabase.from("cms_select_options").insert(
          opts.map((o, i) => ({
            category: "au_state" as const,
            value: o.value,
            label: o.label,
            sort_order: i,
          }))
        );
        if (error) throw error;
      }
      break;
    }
    case "membersPage": {
      const m = value as MembersPageCopy;
      await deleteSingleton(supabase, "cms_members_page");
      const { error } = await supabase.from("cms_members_page").insert({
        id: 1,
        title_before: m.titleBefore,
        title_highlight: m.titleHighlight,
        subtitle: m.subtitle,
      });
      if (error) throw error;
      break;
    }
  }
}
