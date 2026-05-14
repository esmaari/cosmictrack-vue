// src/services/ai.ts
export async function askAI(prompt: string) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error(await res.text());
  const { text } = await res.json();
  return text as string;
}