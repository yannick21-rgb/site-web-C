import { cookies } from "next/headers";

const SESSION_COOKIE = "pcstore_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

export async function createSession(email: string): Promise<string> {
  const payload = `${email}|${Date.now() + SESSION_TTL_MS}`;
  const sig = await sign(payload);
  return `${payload}|${sig}`;
}

export function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionEmail(): Promise<string | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const parts = token.split("|");
  if (parts.length !== 3) return null;
  const [email, expiry, sig] = parts;
  if (Date.now() > Number(expiry)) return null;
  if ((await sign(`${email}|${expiry}`)) !== sig) return null;
  return email;
}

async function sign(input: string): Promise<string> {
  const secret = process.env.AUTH_SECRET || "dev-secret-pcstore";
  const data = new TextEncoder().encode(input);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, data);
  const bytes = new Uint8Array(sig);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i]!.toString(16).padStart(2, "0");
  }
  return hex;
}

export const AUTH_COOKIE = SESSION_COOKIE;
