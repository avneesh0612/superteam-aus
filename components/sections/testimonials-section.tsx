"use client";

import { useState } from "react";
import { Announcement } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Tweet } from "react-tweet";

export function TestimonialsSection({ announcements }: { announcements: Announcement[] }) {
  const [expanded, setExpanded] = useState(false);

  const feedItems = buildFeedItems(announcements);
  const visibleItems = expanded ? feedItems : feedItems.slice(0, 6);

  if (feedItems.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(29,155,240,0.16),transparent_65%)]" />

      <div className="relative mx-auto w-full max-w-[1460px] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">Builder Voices</h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold" />
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-white/70">
            Don&apos;t just take our word for it. See what builders across Australia are saying about Superteam.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://x.com/SuperteamAU"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/85 transition hover:border-white/[0.2] hover:text-white"
            >
              Follow @SuperteamAU
            </a>
            <a
              href="https://x.com/search?q=SuperteamAU&src=typed_query&f=live"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center rounded-full border border-green/30 bg-green/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-green transition hover:bg-green/20"
            >
              Live X Feed
            </a>
          </div>
        </header>

        <div className="relative mt-8">
          <div className="columns-1 gap-3 md:columns-2 lg:columns-3 lg:gap-3 xl:columns-4">
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.28, delay: Math.min(index * 0.03, 0.15) }}
                className="mb-3 break-inside-avoid"
              >
                <TweetEmbedCard tweetId={item.tweetId!} />
              </motion.div>
            ))}
          </div>

          {!expanded && feedItems.length > 6 ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(11,16,22,0),rgba(11,16,22,0.62)_60%,rgba(11,16,22,0.92)_100%)]" />
          ) : null}
        </div>

        {feedItems.length > 6 ? (
          <div className="relative z-10 mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white px-5 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(255,255,255,0.12)]"
            >
              {expanded ? "Collapse feed" : "Expand the feed"}
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

type FeedItem = {
  id: string;
  tweetId?: string;
};

function buildFeedItems(announcements: Announcement[]): FeedItem[] {
  const announcementItems = announcements
    .map(
      (item): FeedItem => ({
      id: `announcement-${item.id}`,
      tweetId: extractTweetId(item.href),
    })
    )
    .filter((item) => Boolean(item.tweetId));

  return announcementItems;
}

function extractTweetId(url?: string) {
  if (!url) return undefined;
  const match = url.match(/(?:x\.com|twitter\.com)\/[^/]+\/status\/(\d+)/i);
  return match?.[1];
}

function TweetEmbedCard({ tweetId }: { tweetId: string }) {
  return (
    <div className="flex h-full flex-col">
      <Tweet id={tweetId} />
    </div>
  );
}
