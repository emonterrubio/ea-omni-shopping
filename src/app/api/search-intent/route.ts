import { NextRequest, NextResponse } from "next/server";
import { SearchQuerySchema } from "@/lib/api-schemas";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `You are an intent parser for an IT equipment store. Given a user search query, return a JSON object with the intent and any relevant parameters.

Examples:
Query: apple computers
{ "intent": "brand_search", "brand": "Apple", "category": "Laptops" }
Query: best laptops available
{ "intent": "best_of", "category": "Laptops", "top": 5 }
Query: monitors with 4k resolution
{ "intent": "feature_search", "category": "Monitors", "feature": "4k resolution" }

Respond with JSON only.`;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`search-intent:${ip}`, 20, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SearchQuerySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing or invalid query" }, { status: 400 });
  }

  const { query } = parsed.data;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: query },
        ],
        max_tokens: 150,
        temperature: 0,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "OpenAI API error" }, { status: 500 });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json({ error: "Failed to parse intent JSON" }, { status: 500 });
    }

    let intentResult: unknown;
    try {
      intentResult = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Failed to parse intent JSON" }, { status: 500 });
    }

    return NextResponse.json(intentResult);
  } catch {
    return NextResponse.json({ error: "Search intent failed" }, { status: 500 });
  }
}
