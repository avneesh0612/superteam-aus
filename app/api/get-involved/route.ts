import { createServiceSupabaseClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

const MAX_LEN = {
  name: 200,
  location: 100,
  role_area: 120,
  skills: 2000,
  experience_level: 120,
  twitter_url: 500,
  github_url: 500,
  portfolio_url: 500,
  looking_for: 2000,
} as const;

function trimToMax(s: string, max: number) {
  return s.slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const supabase = createServiceSupabaseClient();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase credentials missing." }, { status: 500 });
    }

    const payload = {
      name: trimToMax(String(body.name ?? "").trim(), MAX_LEN.name),
      location: trimToMax(String(body.location ?? "").trim(), MAX_LEN.location),
      role_area: trimToMax(String(body.roleArea ?? "").trim(), MAX_LEN.role_area),
      skills: trimToMax(String(body.skills ?? "").trim(), MAX_LEN.skills),
      experience_level: trimToMax(String(body.experienceLevel ?? "").trim(), MAX_LEN.experience_level),
      twitter_url: trimToMax(String(body.twitterUrl ?? "").trim(), MAX_LEN.twitter_url),
      github_url: trimToMax(String(body.githubUrl ?? "").trim(), MAX_LEN.github_url),
      portfolio_url: trimToMax(String(body.portfolioUrl ?? "").trim(), MAX_LEN.portfolio_url),
      looking_for: trimToMax(String(body.lookingFor ?? "").trim(), MAX_LEN.looking_for),
    };

    if (!payload.name || !payload.role_area || !payload.skills || !payload.looking_for) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }

    const { error } = await supabase.from("get_involved_submissions").insert(payload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
