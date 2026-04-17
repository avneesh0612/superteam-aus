"use client";

import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventItem } from "@/lib/types";
import { motion } from "framer-motion";

export function EventsSection({ events }: { events: EventItem[] }) {
  const upcomingEvents = events.filter((event) => event.status !== "past");
  const pastEvents = events.filter((event) => event.status === "past");

  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-24">
      <Container>
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Join us across Sydney, Melbourne, and Brisbane."
          />
          <a href="https://lu.ma" className="text-sm font-semibold text-gold">
            View All Events →
          </a>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="section-shell overflow-hidden rounded-3xl"
            >
              <div className="relative h-56">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 rounded-xl bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  {event.city}
                </div>
              </div>
              <div className="space-y-4 p-8">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <CalendarDays className="h-4 w-4" />
                  {event.date}
                </div>
                <h3 className="font-display text-2xl font-bold text-text">{event.title}</h3>
                <Button href={event.lumaUrl} variant="secondary" className="w-full justify-center rounded-full border-green/20 bg-white/[0.04] text-green">
                  Register on Luma
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {pastEvents.length > 0 ? (
          <div className="mt-14">
            <h3 className="font-display text-2xl font-bold text-text">Past Events</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {pastEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-white/10 bg-panel/80 p-5 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.12em] text-gold">{event.city}</p>
                  <h4 className="mt-2 font-semibold text-text">{event.title}</h4>
                  <p className="mt-1 text-sm text-muted">{event.date}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
