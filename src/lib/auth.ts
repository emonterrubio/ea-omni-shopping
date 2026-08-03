import { createHmac, timingSafeEqual } from "crypto";

export const AUTH_COOKIE_NAME = "omni_shop_session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return secret;
}

export function getSiteAccessPassword(): string {
  const password = process.env.SITE_ACCESS_PASSWORD;
  if (!password) {
    throw new Error("SITE_ACCESS_PASSWORD is not configured");
  }
  return password;
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Create a signed session token (Node.js route handlers). */
export function createSessionToken(): string {
  const secret = getAuthSecret();
  const payload = `auth:${Date.now()}`;
  return `${payload}.${signPayload(payload, secret)}`;
}

/** Verify a signed session token (Node.js). */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const secret = getAuthSecret();
    const lastDot = token.lastIndexOf(".");
    if (lastDot <= 0) return false;
    const payload = token.slice(0, lastDot);
    const signature = token.slice(lastDot + 1);
    const expected = signPayload(payload, secret);
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

export function getSessionCookieOptions(maxAgeSeconds = SESSION_MAX_AGE_MS / 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
