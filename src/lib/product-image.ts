import { findProductByModel, getAllProducts } from "@/data/products";

export const PRODUCT_IMAGE_PLACEHOLDER = "/images/product-placeholder.svg";

/**
 * Legacy / order localStorage model names that don't exactly match the catalog.
 * Maps normalized needles → catalog image paths that exist in /public/images.
 */
const IMAGE_ALIASES: Record<string, string> = {
  "magic keyboard compact": "/images/apple_magic_keyboard.png",
  "apple magic keyboard compact": "/images/apple_magic_keyboard.png",
  "mx vertical": "/images/logitech_mx_master_2s_mouse.png",
  "logitech mx vertical": "/images/logitech_mx_master_2s_mouse.png",
  "u3425we": "/images/dell_u3419w_monitor.png",
  "dell u3425we": "/images/dell_u3419w_monitor.png",
  "evolve2 85 uc": "/images/sony_wh-1000xm5_headphones.png",
  "jabra evolve2 85 uc": "/images/sony_wh-1000xm5_headphones.png",
  "jabra evolve2": "/images/sony_wh-1000xm5_headphones.png",
  "pro 14 plus": "/images/dell_inspiron_16_plus.png",
  "dell pro 14 plus": "/images/dell_inspiron_16_plus.png",
};

/** Known local product images for filename token fallback (keep in sync with public/images). */
const KNOWN_IMAGE_FILES = [
  "apple_magic_keyboard.png",
  "apple_magic_mouse.png",
  "apple_airpods_max_headphones.png",
  "logitech_mx_master_2s_mouse.png",
  "logitech_m650_mouse.png",
  "logitech_m510_mouse.png",
  "logitech_m185_mouse.png",
  "dell_u3419w_monitor.png",
  "dell_u2723qe_monitor.png",
  "dell_inspiron_16_plus.png",
  "dell_xps_13_plus.png",
  "sony_wh-1000xm5_headphones.png",
  "sony_wh-cg720n_headphones.png",
  "bose_quietcomfort_45_headphones.png",
  "bose_quietcomfort_headphones.png",
  "bose_quietcomfort_ultra_headphones.png",
  "jbl_tune_770nc_headphones.png",
  "jbl_live_770nc_headphones.png",
] as const;

function normalizeNeedle(...parts: Array<string | undefined | null>): string {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function isUsableImageSrc(src: string | undefined | null): src is string {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return false;
  if (trimmed === PRODUCT_IMAGE_PLACEHOLDER) return false;
  // Keep http(s) out: next/image throws in dev without images.remotePatterns,
  // and cart/order UIs should prefer catalog/local placeholders instead.
  return trimmed.startsWith("/") || trimmed.startsWith("data:");
}

function lookupAliasImage(model?: string, brand?: string): string | null {
  const candidates = [
    normalizeNeedle(brand, model),
    normalizeNeedle(model),
  ].filter(Boolean);

  for (const key of candidates) {
    if (IMAGE_ALIASES[key]) return IMAGE_ALIASES[key];
  }

  // Partial alias: any alias key contained in the needle (or vice versa)
  const full = normalizeNeedle(brand, model);
  if (full) {
    for (const [alias, image] of Object.entries(IMAGE_ALIASES)) {
      if (full.includes(alias) || alias.includes(full)) return image;
    }
  }

  return null;
}

function lookupFilenameImage(model?: string, brand?: string): string | null {
  const tokens = normalizeNeedle(brand, model)
    .split(" ")
    .filter((t) => t.length > 1 && !["the", "and", "for", "with", "uc"].includes(t));
  if (tokens.length === 0) return null;

  const scored = KNOWN_IMAGE_FILES.map((file) => {
    const haystack = file.replace(/\.(png|jpg|jpeg|webp|svg)$/i, "").replace(/_/g, " ");
    const score = tokens.reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0);
    return { file, score };
  })
    .filter((entry) => entry.score >= Math.min(2, tokens.length))
    .sort((a, b) => b.score - a.score || a.file.length - b.file.length);

  return scored[0] ? `/images/${scored[0].file}` : null;
}

function lookupCatalogImage(model?: string, brand?: string): string | null {
  if (!model) return null;

  const exact = findProductByModel(model);
  if (exact?.image) return exact.image;

  const needle = normalizeNeedle(model);
  const brandedNeedle = normalizeNeedle(brand, model);
  const products = getAllProducts();

  const exactModel = products.find((p) => normalizeNeedle(p.model) === needle);
  if (exactModel?.image) return exactModel.image;

  // Prefer longer catalog model names contained in the stored name
  // e.g. "Magic Keyboard Compact" → "Magic Keyboard"
  const contained = products
    .filter((p) => {
      const catalogModel = normalizeNeedle(p.model);
      return (
        catalogModel.length >= 4 &&
        (needle.includes(catalogModel) || brandedNeedle.includes(catalogModel))
      );
    })
    .sort((a, b) => b.model.length - a.model.length)[0];
  if (contained?.image) return contained.image;

  const includes = products.find((p) => {
    const candidate = normalizeNeedle(p.brand, p.model);
    return (
      candidate === brandedNeedle ||
      candidate === needle ||
      normalizeNeedle(p.model).includes(needle) ||
      needle.includes(normalizeNeedle(p.model))
    );
  });
  if (includes?.image) return includes.image;

  // Token overlap for abbreviated/legacy names — include brand tokens
  const tokens = brandedNeedle
    .split(" ")
    .filter((t) => t.length > 1 && !["the", "and", "for", "with", "uc"].includes(t));
  if (tokens.length > 0) {
    const scored = products
      .map((p) => {
        const haystack = normalizeNeedle(p.brand, p.model);
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
 * Prefers aliases + catalog matches (repairs stale localStorage paths), then the provided src,
 * then a local placeholder.
 */
export function resolveProductImage(
  model?: string,
  image?: string | null,
  brand?: string,
): string {
  const fromAlias = lookupAliasImage(model, brand);
  if (fromAlias) return fromAlias;

  const fromCatalog = lookupCatalogImage(model, brand);
  if (fromCatalog) return fromCatalog;

  const fromFilename = lookupFilenameImage(model, brand);
  if (fromFilename) return fromFilename;

  if (isUsableImageSrc(image)) return image.trim();
  return PRODUCT_IMAGE_PLACEHOLDER;
}
