/**
 * Edge-compatible auth helpers for middleware (Web Crypto).
 */

export const AUTH_COOKIE_NAME = "omni_shop_session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toHex(signature);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function verifySessionTokenEdge(
  token: string | undefined,
  secret: string | undefined,
): Promise<boolean> {
  if (!token || !secret) return false;
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot <= 0) return false;
    const payload = token.slice(0, lastDot);
    const signature = token.slice(lastDot + 1);
    const expected = await signPayload(payload, secret);
    if (!safeEqual(signature, expected)) return false;

    const parts = payload.split(":");
    if (parts[0] !== "auth" || !parts[1]) return false;
    const issuedAt = Number(parts[1]);
    if (!Number.isFinite(issuedAt)) return false;
    if (Date.now() - issuedAt > SESSION_MAX_AGE_MS) return false;
    return true;
  } catch {
    return false;
  }
}
