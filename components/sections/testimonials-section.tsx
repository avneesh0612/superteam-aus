import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Announcement, Testimonial } from "@/lib/types";

export function TestimonialsSection({ testimonials, announcements }: { testimonials: Testimonial[]; announcements: Announcement[] }) {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          title="Builder Voices"
          subtitle="A few signals of how the community is helping builders across Australia."
          accent="gold"
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.id} className="card-surface rounded-[2rem] p-8">
              <p className="text-lg italic leading-8 text-text">“{item.quote}”</p>
              <div className="mt-8">
                <div className="font-semibold text-text">{item.name}</div>
                <div className="text-sm text-muted">{item.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold text-text">Join the Conversation</h3>
              <p className="mt-2 text-muted">Follow @SuperteamAU for the latest builder news and ecosystem drops.</p>
            </div>
            <a
              href="https://x.com/SuperteamAU"
              className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-bg"
            >
              Follow on X
            </a>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-panel p-6 text-sm leading-7 text-muted">
              <blockquote className="twitter-tweet">
                <a href="https://x.com/SuperteamAU" />
              </blockquote>
            </div>
            <div className="rounded-2xl border border-white/5 bg-panel p-6 text-sm leading-7 text-muted">
              <blockquote className="twitter-tweet">
                <a href="https://x.com/SuperteamAU" />
              </blockquote>
            </div>
          </div>

          {announcements.length > 0 ? (
            <div className="mt-8 grid gap-4">
              {announcements.map((item) => (
                <a key={item.id} href={item.href || "#"} className="rounded-2xl border border-white/10 bg-bg/70 p-5 transition hover:border-green/30">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-gold">
                    {item.tag || "Announcement"} {item.date ? <span className="text-muted">• {item.date}</span> : null}
                  </div>
                  <h4 className="mt-2 text-lg font-semibold text-text">{item.title}</h4>
                  <p className="mt-1 text-sm text-muted">{item.summary}</p>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
