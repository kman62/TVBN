import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

type CaptionRequest = {
  asset_id: string;
  prompt?: string;
};

type CaptionResponse = {
  asset_id: string;
  caption: string;
  ai_model: string;
};

const OPENAI_MODEL = Deno.env.get("OPENAI_CHAT_MODEL") ?? "gpt-4o-mini";
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const openAIKey = Deno.env.get("OPENAI_API_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined for the ai-caption function");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function generateCaption(assetId: string, prompt?: string): Promise<CaptionResponse> {
  const { data: asset, error: fetchError } = await supabase
    .from("content_assets")
    .select("id, title, caption, chapter_id")
    .eq("id", assetId)
    .single();

  if (fetchError || !asset) {
    throw new Error(fetchError?.message ?? "Asset not found");
  }

  const systemPrompt =
    "You are a helpful social media strategist writing inclusive, uplifting captions for community service organizations.";
  const userPrompt =
    prompt ??
    `Write a social-ready caption for the activity titled "${asset.title}". Keep it under 280 characters and suggest 3 hashtags.`;

  if (!openAIKey) {
    return {
      asset_id: assetId,
      caption: `${asset.title} — placeholder caption (set OPENAI_API_KEY to enable AI generation).`,
      ai_model: "placeholder",
    };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAIKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${errorText}`);
  }

  const completion = await response.json();
  const caption = completion?.choices?.[0]?.message?.content?.trim();

  if (!caption) {
    throw new Error("Could not generate caption");
  }

  await supabase
    .from("content_assets")
    .update({
      caption,
      ai_caption: {
        model: OPENAI_MODEL,
        prompt: userPrompt,
        generated_at: new Date().toISOString(),
      },
    })
    .eq("id", assetId);

  return { asset_id: assetId, caption, ai_model: OPENAI_MODEL };
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body: CaptionRequest = await req.json();
    if (!body.asset_id) {
      return new Response(JSON.stringify({ error: "asset_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await generateCaption(body.asset_id, body.prompt);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI caption error", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
