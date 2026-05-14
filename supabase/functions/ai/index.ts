import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// CORS başlıkları
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // istersen buraya kendi domainini yaz
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

Deno.serve(async (req) => {
  // 1) Preflight (OPTIONS) isteğini erken yanıtla
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2) Prompt'u al
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 3) Secret'ı oku
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "No OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 4) OpenAI'ye isteği at (Chat Completions)
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // istersen gpt-4.1-mini de deneyebilirsin
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    // 5) Cevabı oku
    const bodyText = await r.text();

    if (!r.ok) {
      // OpenAI hata metnini görünür döndür
      return new Response(JSON.stringify({ error: bodyText }), {
        status: r.status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let data: any;
    try {
      data = JSON.parse(bodyText);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON", raw: bodyText }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const text = data?.choices?.[0]?.message?.content?.trim?.() ?? "";

    // 6) Başarı
    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    // 7) Beklenmeyen hata
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
