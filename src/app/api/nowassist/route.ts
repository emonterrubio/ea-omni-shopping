import { NextRequest, NextResponse } from "next/server";
import {
  NowAssistClaudeResponseSchema,
  NowAssistRequestSchema,
} from "@/lib/api-schemas";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  findProductByModel,
  getSearchableProducts,
  type CatalogProduct,
} from "@/data/products";
import { resolveProductImage } from "@/lib/product-image";

const CLAUDE_MODEL = "claude-sonnet-4-5";

type CompactProduct = {
  brand: string;
  model: string;
  category: string;
  price: number;
  description: string;
  processor?: string;
  memory?: string;
  storage?: string;
  graphics?: string;
  display?: string;
};

function buildCompactCatalog(message: string): CompactProduct[] {
  const all = getSearchableProducts();
  const lower = message.toLowerCase();

  const categoryHints: { keys: string[]; categories: string[] }[] = [
    { keys: ["laptop", "notebook", "macbook", "video edit", "gaming", "travel"], categories: ["Laptops", "Hardware"] },
    { keys: ["desktop", "tower", "workstation"], categories: ["Desktops", "Hardware"] },
    { keys: ["monitor", "display", "screen"], categories: ["Monitors"] },
    { keys: ["headphone", "headset", "earbuds", "audio"], categories: ["Headphones"] },
    { keys: ["mouse", "mice"], categories: ["Mice"] },
    { keys: ["keyboard"], categories: ["Keyboards"] },
    { keys: ["webcam", "camera"], categories: ["Webcams"] },
    { keys: ["dock", "docking"], categories: ["Docking Stations"] },
    { keys: ["backpack", "bag"], categories: ["Backpacks"] },
  ];

  const matchedCategories = new Set<string>();
  for (const hint of categoryHints) {
    if (hint.keys.some((key) => lower.includes(key))) {
      hint.categories.forEach((c) => matchedCategories.add(c));
    }
  }

  let candidates = all;
  if (matchedCategories.size > 0) {
    const filtered = all.filter((p) => matchedCategories.has(p.category));
    if (filtered.length > 0) candidates = filtered;
  }

  // Cap catalog payload for token budget
  const limited = candidates.slice(0, 80);

  return limited.map((p) => ({
    brand: p.brand,
    model: p.model,
    category: p.category,
    price: p.price,
    description: (p.card_description || p.description || "").slice(0, 160),
    processor: typeof p.processor === "string" ? p.processor : undefined,
    memory: typeof p.memory === "string" ? p.memory : undefined,
    storage: typeof p.storage === "string" ? p.storage : undefined,
    graphics: typeof p.graphics === "string" ? p.graphics : undefined,
    display: typeof p.display === "string" ? p.display : undefined,
  }));
}

function toCardProduct(product: CatalogProduct, matchLabel?: string) {
  return {
    brand: product.brand,
    model: product.model,
    category: product.category,
    description: product.card_description || product.description || "",
    image: resolveProductImage(product.model, product.image, product.brand),
    price: product.price,
    recommended: Boolean(product.recommended),
    matchLabel,
  };
}

function resolveCatalogProduct(modelName: string): CatalogProduct | null {
  const exact = findProductByModel(modelName);
  if (exact) return exact;

  const needle = modelName.toLowerCase().trim();
  const all = getSearchableProducts();
  const contained = all
    .filter((p) => needle.includes(p.model.toLowerCase()) || p.model.toLowerCase().includes(needle))
    .sort((a, b) => b.model.length - a.model.length)[0];
  return contained || null;
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("No JSON object found");
  }
}

function recoverModelsFromText(text: string, catalog: CompactProduct[]): string[] {
  const found: string[] = [];
  for (const item of catalog) {
    if (text.toLowerCase().includes(item.model.toLowerCase())) {
      found.push(item.model);
    }
  }
  return found.slice(0, 3);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`nowassist:${ip}`, 20, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = NowAssistRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing or invalid message" }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json(
      { error: "NowAssist is not configured (missing ANTHROPIC_API_KEY)" },
      { status: 503 },
    );
  }

  const { message, history = [], ordersSummary = [], suggestedModels = [] } = parsed.data;
  const catalog = buildCompactCatalog(message);

  const systemPrompt = `You are NowAssist, the IT Hardware Assistant for an internal employee hardware storefront.

Return JSON only (no markdown, no code fences) with this exact shape:
{"reply":"1-2 short friendly sentences","products":["Exact Model Name From Catalog"],"addToCart":["Exact Model Name From Catalog"]}

Rules:
1. Infer the user's need (e.g. video editing → stronger GPU/RAM/storage) and summarize briefly in "reply".
2. For recommendations, put items ONLY in "products" (max 3). Use exact catalog "model" strings. Leave "addToCart": [].
3. NEVER list product names, prices, or bullet specs inside "reply". The UI renders product cards from "products".
4. When the user asks to add suggested/recommended items to their cart (e.g. "add those", "add them to my cart", "put all in cart"):
   - Put the models to add in "addToCart" (max 5). Prefer "suggestedModels" from the request when the user means prior recommendations.
   - Use exact catalog model names. Set "products": [] unless you are also showing new recommendations.
   - Only claim items were added if "addToCart" is non-empty.
5. For order-status questions, use ordersSummary only, invent nothing, and return "products": [] and "addToCart": [].
6. If nothing fits, say so briefly and return empty arrays.

Guidance:
- Video editing / creative / heavy graphics → prefer stronger GPU, more RAM, larger storage.
- Travel / lightweight → prefer lighter laptops.
- Peripherals → match category when mentioned.

Catalog (JSON):
${JSON.stringify(catalog)}

Recently suggested models (JSON, may be empty):
${JSON.stringify(suggestedModels)}

Orders summary (JSON, may be empty):
${JSON.stringify(ordersSummary)}`;

  const claudeMessages = [
    ...history.map((turn) => ({
      role: turn.role as "user" | "assistant",
      content: turn.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 800,
        temperature: 0.2,
        system: systemPrompt,
        messages: claudeMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("Anthropic API error:", response.status, errText.slice(0, 300));
      return NextResponse.json({ error: "Claude API error" }, { status: 500 });
    }

    const data = await response.json();
    const text = (data.content || [])
      .filter((block: { type?: string }) => block.type === "text")
      .map((block: { text?: string }) => block.text || "")
      .join("\n")
      .trim();

    if (!text) {
      return NextResponse.json({ error: "Empty Claude response" }, { status: 500 });
    }

    let rawJson: unknown;
    try {
      rawJson = extractJsonObject(text);
    } catch {
      return NextResponse.json({ error: "Failed to parse Claude JSON" }, { status: 500 });
    }

    const claudeParsed = NowAssistClaudeResponseSchema.safeParse(rawJson);
    if (!claudeParsed.success) {
      return NextResponse.json({ error: "Invalid Claude response shape" }, { status: 500 });
    }

    let modelNames = claudeParsed.data.products;
    if (modelNames.length === 0) {
      modelNames = recoverModelsFromText(claudeParsed.data.reply, catalog);
    }

    let addToCartNames = claudeParsed.data.addToCart;
    // If the user clearly asked to add prior suggestions but Claude omitted addToCart, use suggestedModels.
    const wantsCart =
      /\b(add|put|move)\b[\s\S]{0,40}\b(cart|basket)\b|\badd (them|those|all|it)\b/i.test(
        message,
      );
    if (addToCartNames.length === 0 && wantsCart && suggestedModels.length > 0) {
      addToCartNames = suggestedModels;
    }

    const products = modelNames
      .map((modelName) => resolveCatalogProduct(modelName))
      .filter((p): p is CatalogProduct => Boolean(p))
      .slice(0, 3)
      .map((p) => toCardProduct(p));

    const addToCart = addToCartNames
      .map((modelName) => resolveCatalogProduct(modelName))
      .filter((p): p is CatalogProduct => Boolean(p))
      .slice(0, 5)
      .map((p) => toCardProduct(p));

    // Keep reply short for card UI — strip accidental markdown lists
    const reply = claudeParsed.data.reply
      .replace(/\*\*/g, "")
      .split("\n")
      .filter((line) => !line.trim().startsWith("-") && !line.trim().startsWith("*"))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    let finalReply = reply;
    if (addToCart.length > 0) {
      finalReply =
        reply ||
        `Added ${addToCart.length} item${addToCart.length === 1 ? "" : "s"} to your cart.`;
    } else if (!finalReply) {
      finalReply = products.length
        ? "Here are a few options that fit what you described."
        : "I couldn't find a strong match in the catalog.";
    }

    if (wantsCart && addToCart.length === 0) {
      finalReply =
        "I don't have prior recommendations to add. Ask me for gear first, then say “add those to my cart.”";
    }

    return NextResponse.json({
      reply: finalReply,
      products,
      addToCart,
    });
  } catch (error) {
    console.error("NowAssist error:", error);
    return NextResponse.json({ error: "NowAssist failed" }, { status: 500 });
  }
}
