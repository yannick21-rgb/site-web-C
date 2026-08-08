import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "pcstore_admin_session";

async function verifyToken(token: string): Promise<boolean> {
  const parts = token.split("|");
  if (parts.length !== 3) return false;
  const [email, expiry, sig] = parts;
  if (!email || !expiry || Date.now() > Number(expiry)) return false;
  const secret = process.env.AUTH_SECRET || "dev-secret-pcstore";
  const data = new TextEncoder().encode(`${email}|${expiry}`);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expected = await crypto.subtle.sign("HMAC", key, data);
  const bytes = new Uint8Array(expected);
  let expectedHex = "";
  for (let i = 0; i < bytes.length; i++) {
    expectedHex += bytes[i]!.toString(16).padStart(2, "0");
  }
  return expectedHex === sig;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = token ? await verifyToken(token) : false;

  if (!isLoginPage && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isLoginPage && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
