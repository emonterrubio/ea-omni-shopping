import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getSessionCookieOptions,
  getSiteAccessPassword,
} from "@/lib/auth";

const LoginBodySchema = z.object({
  password: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = LoginBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    let expectedPassword: string;
    try {
      expectedPassword = getSiteAccessPassword();
    } catch {
      return NextResponse.json(
        { error: "Server auth is not configured" },
        { status: 500 },
      );
    }

    if (parsed.data.password !== expectedPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    let token: string;
    try {
      token = createSessionToken();
    } catch {
      return NextResponse.json(
        { error: "Server auth is not configured" },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(AUTH_COOKIE_NAME, token, getSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
