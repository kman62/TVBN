import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const body = await req.json();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: `Create a social caption (<=80 words) promoting ${body.prompt}`
    });

    const caption = completion.output_text.trim();

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    await supabase.from('content_assets').insert({
      member_id: body.memberId,
      title: body.prompt,
      caption,
      status: 'draft'
    });

    return new Response(JSON.stringify({ caption }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
