import { createServiceSupabaseClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createServiceSupabaseClient();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase credentials missing." }, { status: 500 });
    }

    const payload = {
      name: String(body.name || "").trim(),
      location: String(body.location || "").trim(),
      role_area: String(body.roleArea || "").trim(),
      skills: String(body.skills || "").trim(),
      experience_level: String(body.experienceLevel || "").trim(),
      twitter_url: String(body.twitterUrl || "").trim(),
      github_url: String(body.githubUrl || "").trim(),
      portfolio_url: String(body.portfolioUrl || "").trim(),
      looking_for: String(body.lookingFor || "").trim(),
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
