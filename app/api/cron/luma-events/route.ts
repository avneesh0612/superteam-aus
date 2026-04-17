import { getCmsContent, upsertCmsContent } from "@/lib/cms";
import type { EventItem } from "@/lib/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LUMA_BASE_URL = "https://public-api.luma.com";
const LUMA_EVENTS_PATH = "/v1/calendar/list-events";
const MAX_PAGES = 5;
const DEFAULT_LIMIT = 50;

type LumaCalendarEvent = {
  api_id?: string;
  id?: string;
  name?: string;
  title?: string;
  url?: string;
  start_at?: string;
  starts_at?: string;
  cover_url?: string;
  image_url?: string;
  city?: string;
  timezone?: string;
  geo_address_info?: {
    city?: string;
  };
};

type LumaEntry = {
  id?: string;
  event?: LumaCalendarEvent;
  start_at?: string;
};

type LumaListEventsResponse = {
  entries?: LumaEntry[];
  has_more?: boolean;
  next_cursor?: string;
};

function isAuthorizedRequest(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return process.env.NODE_ENV !== "production";
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

function formatEventDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "TBD";
  return date.toLocaleDateString("en-AU", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mapLumaEntryToEventItem(entry: LumaEntry): EventItem | null {
  const event = entry.event ?? {};
  const idBase = event.api_id || event.id || entry.id;
  const title = event.name || event.title;
  const startAt = event.start_at || event.starts_at || entry.start_at;
  const lumaUrl = event.url;

  if (!idBase || !title || !startAt || !lumaUrl) return null;

  const parsed = new Date(startAt);
  const isUpcoming = !Number.isNaN(parsed.getTime()) && parsed.getTime() >= Date.now();
  const city = event.geo_address_info?.city || event.city || "Online";
  const image = event.cover_url || event.image_url || "/logo-mark.svg";

  return {
    id: `luma-${idBase}`,
    title,
    city,
    date: formatEventDate(startAt),
    image,
    lumaUrl,
    status: isUpcoming ? "upcoming" : "past",
  };
}

async function fetchLumaEvents(apiKey: string) {
  const allEntries: LumaEntry[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const url = new URL(`${LUMA_BASE_URL}${LUMA_EVENTS_PATH}`);
    url.searchParams.set("pagination_limit", String(DEFAULT_LIMIT));
    if (cursor) url.searchParams.set("pagination_cursor", cursor);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-luma-api-key": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Luma API request failed (${response.status}): ${text.slice(0, 240)}`);
    }

    const body = (await response.json()) as LumaListEventsResponse;
    const entries = body.entries ?? [];
    allEntries.push(...entries);

    if (!body.has_more || !body.next_cursor) break;
    cursor = body.next_cursor;
  }

  return allEntries
    .map(mapLumaEntryToEventItem)
    .filter((event): event is EventItem => Boolean(event));
}

export async function GET(request: Request) {
  try {
    if (!isAuthorizedRequest(request)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const lumaApiKey = process.env.LUMA_API_KEY;
    if (!lumaApiKey) {
      return NextResponse.json({ error: "LUMA_API_KEY is missing." }, { status: 500 });
    }

    const lumaEvents = await fetchLumaEvents(lumaApiKey);
    const cms = await getCmsContent();
    const manualEvents = cms.events.filter((event) => !event.id.startsWith("luma-"));
    const mergedEvents = [...lumaEvents, ...manualEvents];
    await upsertCmsContent("events", mergedEvents);

    return NextResponse.json({
      ok: true,
      imported: lumaEvents.length,
      preservedManual: manualEvents.length,
      total: mergedEvents.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: (error as Error).message || "Luma event sync failed.",
      },
      { status: 500 }
    );
  }
}
