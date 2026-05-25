export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
const COOKIE = process.env.SESSION_COOKIE_NAME ?? "__session";
const MAX_AGE = Number(process.env.SESSION_COOKIE_MAX_AGE ?? 60 * 60 * 8); // s
export async function POST(req: Request) {
  try {
    const { idToken, remember } = await req.json();
    if (!idToken)
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    const expiresIn = (remember ? MAX_AGE : 2 * 60 * 60) * 1000; // ms
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "Cannot create session" },
      { status: 401 },
    );
  }
}