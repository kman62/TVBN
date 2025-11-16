import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const digestSender = Deno.env.get("DIGEST_SENDER") ?? "digest@tvbn.local";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for the weekly-digest function");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

async function buildDigest() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const sinceDate = since.toISOString().slice(0, 10);

  const { data: activities, error: activityError } = await supabase
    .from("activities")
    .select("chapter_id, title, activity_type, activity_date")
    .gte("activity_date", sinceDate)
    .order("activity_date", { ascending: false });

  if (activityError) {
    throw activityError;
  }

  const { data: chapters, error: chapterError } = await supabase
    .from("chapters")
    .select("id, name, description");

  if (chapterError) {
    throw chapterError;
  }

  type Activity = {
    chapter_id: string;
    title: string;
    activity_type: string;
    activity_date: string;
  };

  const activityMap = new Map<string, Activity[]>();
  (activities ?? []).forEach((activity) => {
    if (!activityMap.has(activity.chapter_id)) {
      activityMap.set(activity.chapter_id, []);
    }
    activityMap.get(activity.chapter_id)!.push(activity);
  });

  const digest = (chapters ?? []).map((chapter) => ({
    chapter,
    highlights: activityMap.get(chapter.id) ?? [],
  }));

  return { since: sinceDate, digest };
}

async function sendDigestEmail(payload: Awaited<ReturnType<typeof buildDigest>>) {
  // Placeholder for sending email (Resend/Postmark/etc.)
  console.log(`Sending weekly digest email from ${digestSender}`);
  payload.digest.forEach((entry) => {
    console.log(`Chapter ${entry.chapter.name} has ${entry.highlights.length} highlights.`);
  });
  return { sent: true };
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const digest = await buildDigest();
    const sendResult = await sendDigestEmail(digest);
    return new Response(JSON.stringify({ ...sendResult, digest }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("weekly-digest error", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
