import { findProductByModel, getAllProducts } from "@/data/products";

export const PRODUCT_IMAGE_PLACEHOLDER = "/images/product-placeholder.svg";

function isUsableImageSrc(src: string | undefined | null): src is string {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return false;
  return (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  );
}

function lookupCatalogImage(model?: string): string | null {
  if (!model) return null;

  const exact = findProductByModel(model);
  if (exact?.image) return exact.image;

  const needle = model.toLowerCase().trim();
  const products = getAllProducts();

  const exactModel = products.find((p) => p.model.toLowerCase() === needle);
  if (exactModel?.image) return exactModel.image;

  // Prefer longer catalog model names contained in the stored name
  // e.g. "Magic Keyboard Compact" → "Magic Keyboard"
  const contained = products
    .filter((p) => needle.includes(p.model.toLowerCase()) && p.model.length >= 4)
    .sort((a, b) => b.model.length - a.model.length)[0];
  if (contained?.image) return contained.image;

  const includes = products.find((p) => {
    const candidate = `${p.brand} ${p.model}`.toLowerCase();
    return (
      candidate === needle ||
      p.model.toLowerCase().includes(needle) ||
      needle.includes(p.model.toLowerCase())
    );
  });
  if (includes?.image) return includes.image;

  // Token overlap for abbreviated/legacy names like "Pro 14 Plus"
  const tokens = needle
    .split(/[\s/_-]+/)
    .filter((t) => t.length > 1 && !["the", "and", "for", "with"].includes(t));
  if (tokens.length > 0) {
    const scored = products
      .map((p) => {
        const haystack = `${p.brand} ${p.model}`.toLowerCase();
        const score = tokens.reduce(
          (sum, token) => sum + (haystack.includes(token) ? 1 : 0),
          0,
        );
        return { p, score };
      })
      .filter((entry) => entry.score >= Math.min(2, tokens.length))
      .sort((a, b) => b.score - a.score || b.p.model.length - a.p.model.length);
    if (scored[0]?.p.image) return scored[0].p.image;
  }

  return null;
}

/**
 * Resolve a displayable product image.
 * Prefers catalog matches (repairs stale localStorage paths), then the provided src,
 * then a local placeholder.
 */
export function resolveProductImage(
  model?: string,
  image?: string | null,
): string {
  const fromCatalog = lookupCatalogImage(model);
  if (fromCatalog) return fromCatalog;
  if (isUsableImageSrc(image)) return image.trim();
  return PRODUCT_IMAGE_PLACEHOLDER;
}
