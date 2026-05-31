import { randomUUID } from "crypto"
import { createHmac } from "crypto"

const SECRET = process.env.GUEST_TOKEN_SECRET ?? "dev-guest-secret-change-in-prod"
const COOKIE_NAME = "mb_guest"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

/** Sign a guest ID so it can't be forged */
export function signGuestId(id: string): string {
  const sig = createHmac("sha256", SECRET).update(id).digest("hex").slice(0, 16)
  return `${id}.${sig}`
}

/** Verify and extract the raw UUID from a signed guest token */
export function verifyGuestToken(token: string): string | null {
  const [id, sig] = token.split(".")
  if (!id || !sig) return null
  const expected = createHmac("sha256", SECRET).update(id).digest("hex").slice(0, 16)
  return sig === expected ? id : null
}

/** Generate a new signed guest token */
export function newGuestToken(): string {
  return signGuestId(randomUUID())
}

export const GUEST_COOKIE = {
  name: COOKIE_NAME,
  maxAge: COOKIE_MAX_AGE,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
}

/** Hash an IP address so we don't store raw IPs */
export function hashIP(ip: string): string {
  return createHmac("sha256", SECRET).update(ip).digest("hex").slice(0, 12)
}

/** Extract the real IP from a Next.js request */
export function getClientIP(request: Request): string {
  const forwarded = (request.headers as Headers).get("x-forwarded-for")
  const real = (request.headers as Headers).get("x-real-ip")
  const ip = forwarded?.split(",")[0].trim() ?? real ?? "unknown"
  return ip
}
