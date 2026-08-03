import { NextRequest, NextResponse } from "next/server";
import { getSearchableProducts, type SearchableProduct } from "@/data/products";
import { SearchQuerySchema } from "@/lib/api-schemas";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

type ScoredProduct = SearchableProduct & { score: number };

function smartSearch(query: string, allProducts: SearchableProduct[]): ScoredProduct[] {
  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/);

  const brands = [
    "apple", "dell", "hp", "lenovo", "microsoft", "razer", "bose", "sony", "jbl",
    "skullcandy", "logitech", "cherry", "arteck", "keychron", "nulea", "acer",
    "alienware", "lg", "samsung",
  ];
  const categories = [
    "laptop", "laptops", "desktop", "desktops", "monitor", "monitors",
    "headphone", "headphones", "mouse", "mice", "keyboard", "keyboards",
    "webcam", "webcams", "dock", "docking", "station", "stations",
    "backpack", "backpacks", "bag", "bags", "product", "products", "pc",
  ];

  const queryBrand = queryWords.find((word) => brands.includes(word));
  const queryCategory = queryWords.find((word) => categories.includes(word));
  const isBestQuery = queryWords.some((word) =>
    ["best", "top", "premium", "high-end", "elite", "pro"].includes(word),
  );

  let candidates = allProducts;
  if (queryBrand) {
    candidates = allProducts.filter(
      (product) => product.brand.toLowerCase() === queryBrand,
    );
  }

  if (queryCategory && candidates.length > 0) {
    const categorySingular = queryCategory.replace(/s$/, "");
    candidates = candidates.filter((product) => {
      const productCategory = product.category.toLowerCase();
      return productCategory.includes(categorySingular);
    });
  }

  if (candidates.length > 0 && isBestQuery) {
    const rankedCandidates = candidates.map((product) => {
      let score = 100;

      if (
        product.category === "Hardware" ||
        product.category === "Laptops" ||
        product.category === "Desktops"
      ) {
        score += (product.processorTier || 1) * 20;
        score += (product.graphicsTier || 1) * 20;
        score += (product.priceTier || 1) * 10;
        if ((product.displaySize || 0) > 15) score += 10;
      } else if (product.category === "Monitors") {
        score += (product.resolutionTier || 1) * 25;
        score += (product.sizeTier || 1) * 15;
        score += (product.priceTier || 1) * 10;
        if ((product.refreshRate || 0) >= 144) score += 15;
      } else if (product.category === "Headphones") {
        score += (product.priceTier || 1) * 20;
        if (product.recommended) score += 25;
      } else if (product.category === "Mice") {
        score += (product.priceTier || 1) * 15;
        score += (product.buttonCount || 2) * 5;
        if (product.recommended) score += 20;
      } else if (product.category === "Keyboards") {
        score += (product.priceTier || 1) * 15;
        score += (product.keyCount || 87) / 10;
        if (product.recommended) score += 20;
      } else if (product.category === "Webcams") {
        score += (product.priceTier || 1) * 15;
        score += (product.resolutionTier || 1) * 20;
        if (product.recommended) score += 20;
      } else if (product.category === "Docking Stations") {
        score += (product.priceTier || 1) * 15;
        if (product.recommended) score += 20;
      } else if (product.category === "Backpacks") {
        score += (product.priceTier || 1) * 10;
        if (product.recommended) score += 15;
      }

      return { ...product, score };
    });

    return rankedCandidates.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  if (candidates.length > 0) {
    return candidates.map((product) => ({ ...product, score: 100 }));
  }

  const scoredProducts = allProducts.map((product) => {
    let score = 0;
    const productText = product.searchableText;

    if (queryBrand && product.brand.toLowerCase() === queryBrand) score += 100;
    if (queryBrand && product.brand.toLowerCase().includes(queryBrand)) score += 50;

    if (queryCategory) {
      const productCategory = product.category.toLowerCase();
      if (productCategory.includes(queryCategory.replace(/s$/, ""))) score += 75;
    }

    if (productText.includes(normalizedQuery)) score += 200;

    queryWords.forEach((word) => {
      if (productText.includes(word)) score += 10;
    });

    if (queryWords.includes("product") || queryWords.includes("products")) {
      if (queryBrand && product.brand.toLowerCase() === queryBrand) score += 150;
    }

    if (queryBrand && queryCategory) {
      const productCategory = product.category.toLowerCase();
      if (
        product.brand.toLowerCase() === queryBrand &&
        productCategory.includes(queryCategory.replace(/s$/, ""))
      ) {
        score += 300;
      }
    }

    return { ...product, score };
  });

  return scoredProducts
    .filter((product) => product.score > 0)
    .sort((a, b) => b.score - a.score);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`ai-product-search:${ip}`, 40, 60_000);
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

  try {
    const allProducts = getSearchableProducts();
    const searchResults = smartSearch(query, allProducts);
    const isBestQuery = /best|top|premium|high-end|elite|pro/i.test(query);
    const maxResults = isBestQuery ? 3 : 20;
    const results = searchResults.slice(0, maxResults);

    return NextResponse.json({
      results,
      totalFound: searchResults.length,
      query,
    });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
