import { createServiceSupabaseClient } from "@/lib/supabase";

export type GetInvolvedSubmission = {
  id: number;
  name: string;
  location: string | null;
  role_area: string;
  skills: string;
  twitter_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  looking_for: string;
  status?: "new" | "reviewing" | "shortlisted" | "accepted" | "rejected" | string;
  created_at: string;
};

export async function listGetInvolvedSubmissions(limit = 100): Promise<GetInvolvedSubmission[]> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("get_involved_submissions")
    .select("id,name,location,role_area,skills,twitter_url,github_url,portfolio_url,looking_for,status,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  // Backward compatibility for databases before the status migration.
  if (error) {
    const { data: legacyData, error: legacyError } = await supabase
      .from("get_involved_submissions")
      .select("id,name,location,role_area,skills,twitter_url,github_url,portfolio_url,looking_for,created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (legacyError || !legacyData) return [];
    return legacyData as GetInvolvedSubmission[];
  }

  if (!data) return [];
  return data as GetInvolvedSubmission[];
}

export async function supportsSubmissionStatusColumn(): Promise<boolean> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("get_involved_submissions")
    .select("status")
    .limit(1);

  if (!error) return true;
  if (error.code === "PGRST204") return false;
  return false;
}

export async function updateGetInvolvedSubmissionStatus(id: number, status: string) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) throw new Error("Missing Supabase service role credentials.");

  const { error } = await supabase
    .from("get_involved_submissions")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}
