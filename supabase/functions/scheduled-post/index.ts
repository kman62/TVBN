import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const cronSecret = Deno.env.get("CRON_SECRET");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for the scheduled-post function");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

async function publishDuePosts() {
  const now = new Date().toISOString();
  const { data: assets, error } = await supabase
    .from("content_assets")
    .select("id, chapter_id, title, caption, media_url")
    .eq("status", "SCHEDULED")
    .lte("scheduled_for", now);

  if (error) {
    throw error;
  }

  if (!assets?.length) {
    return { published: 0 };
  }

  const publishResults = await Promise.all(
    assets.map(async (asset) => {
      // Placeholder for actual social posting integration.
      console.log(`Publishing asset ${asset.id} for chapter ${asset.chapter_id}`);
      const { error: updateError } = await supabase
        .from("content_assets")
        .update({ status: "PUBLISHED", updated_at: new Date().toISOString() })
        .eq("id", asset.id);
      if (updateError) {
        throw updateError;
      }
      return asset.id;
    }),
  );

  return { published: publishResults.length, asset_ids: publishResults };
}

function isAuthorized(req: Request) {
  if (!cronSecret) {
    return true;
  }
  const authHeader = req.headers.get("Authorization") ?? "";
  return authHeader === `Bearer ${cronSecret}`;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const result = await publishDuePosts();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("scheduled-post error", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
