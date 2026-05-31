/**
 * Rate limiting strategy:
 *
 * Authenticated users:
 *   Free tier    → 3 generations / day (key: user:{userId}:{date})
 *   Premium tier → unlimited
 *
 * Unauthenticated guests:
 *   Guest token  → 3 generations / day (key: guest:{guestId}:{date})
 *   IP hash      → 15 generations / day (key: ip:{hashedIP}:{date})
 *                  Higher IP limit allows up to ~5 people on same WiFi
 *
 * Both guest limits must pass — prevents cookie-clearing abuse (IP catches it)
 * while not over-blocking shared networks (guest token gives individual quota).
 *
 * Storage: Upstash Redis (sliding window). Gracefully falls back to "allow all"
 * when UPSTASH_REDIS_REST_URL is not set (dev without Redis configured).
 */

import type { NextRequest } from "next/server"

const FREE_DAILY_LIMIT = 3
const IP_DAILY_LIMIT = 15 // ~5 people per shared IP

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10) // "2026-05-31"
}

// ── Upstash client (lazy, only initialised when env vars are present) ────────

let _redis: import("@upstash/redis").Redis | null = null

function getRedis() {
  if (_redis) return _redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const { Redis } = require("@upstash/redis") as typeof import("@upstash/redis")
  _redis = new Redis({ url, token })
  return _redis
}

// ── Core increment + check ───────────────────────────────────────────────────

async function incrementKey(key: string, limit: number): Promise<{ allowed: boolean; count: number }> {
  const redis = getRedis()

  if (!redis) {
    // No Redis configured — allow all (dev mode)
    return { allowed: true, count: 0 }
  }

  // Increment and set 25-hour TTL (covers midnight UTC rollover)
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, 60 * 60 * 25)

  return { allowed: count <= limit, count }
}

async function peekKey(key: string): Promise<number> {
  const redis = getRedis()
  if (!redis) return 0
  const val = await redis.get<number>(key)
  return val ?? 0
}

// ── Public API ───────────────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean
  remaining: number   // credits left today
  resetAt: string     // ISO date of next reset (midnight UTC)
  reason?: "guest_limit" | "ip_limit" | "user_limit"
}

/** Check + consume one credit. Call this BEFORE executing a generation. */
export async function consumeCredit(options: {
  userId?: string | null
  guestId?: string | null
  ipHash?: string | null
  isPremium?: boolean
}): Promise<RateLimitResult> {
  const { userId, guestId, ipHash, isPremium } = options
  const today = todayUTC()

  // Premium users are never rate-limited
  if (isPremium) {
    return { allowed: true, remaining: Infinity, resetAt: tomorrow() }
  }

  // Authenticated free user
  if (userId) {
    const key = `mb:user:${userId}:${today}`
    const { allowed, count } = await incrementKey(key, FREE_DAILY_LIMIT)
    return {
      allowed,
      remaining: Math.max(0, FREE_DAILY_LIMIT - count),
      resetAt: tomorrow(),
      reason: allowed ? undefined : "user_limit",
    }
  }

  // Anonymous guest — must pass BOTH guest token limit AND IP limit
  const guestKey = guestId ? `mb:guest:${guestId}:${today}` : null
  const ipKey = ipHash ? `mb:ip:${ipHash}:${today}` : null

  // Check IP first (don't consume guest token if IP already blocked)
  if (ipKey) {
    const ipCount = await peekKey(ipKey)
    if (ipCount >= IP_DAILY_LIMIT) {
      return { allowed: false, remaining: 0, resetAt: tomorrow(), reason: "ip_limit" }
    }
  }

  // Consume guest token credit
  if (guestKey) {
    const { allowed, count } = await incrementKey(guestKey, FREE_DAILY_LIMIT)
    if (!allowed) {
      return { allowed: false, remaining: 0, resetAt: tomorrow(), reason: "guest_limit" }
    }
    // Also increment IP counter (non-blocking)
    if (ipKey) await incrementKey(ipKey, IP_DAILY_LIMIT)
    return {
      allowed: true,
      remaining: Math.max(0, FREE_DAILY_LIMIT - count),
      resetAt: tomorrow(),
    }
  }

  // No identifiers at all — allow (should not happen in practice)
  return { allowed: true, remaining: FREE_DAILY_LIMIT, resetAt: tomorrow() }
}

/** Peek at remaining credits without consuming one */
export async function getRemainingCredits(options: {
  userId?: string | null
  guestId?: string | null
  isPremium?: boolean
}): Promise<{ remaining: number; total: number; resetAt: string }> {
  const { userId, guestId, isPremium } = options
  const today = todayUTC()

  if (isPremium) return { remaining: Infinity, total: Infinity, resetAt: tomorrow() }

  const key = userId
    ? `mb:user:${userId}:${today}`
    : guestId
    ? `mb:guest:${guestId}:${today}`
    : null

  const used = key ? await peekKey(key) : 0
  return {
    remaining: Math.max(0, FREE_DAILY_LIMIT - used),
    total: FREE_DAILY_LIMIT,
    resetAt: tomorrow(),
  }
}

function tomorrow(): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + 1)
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

/** Extract rate-limit identifiers from a Next.js API request */
export function getIdentifiers(req: NextRequest): {
  guestId: string | null
  ipHash: string | null
} {
  const { verifyGuestToken, hashIP, getClientIP } = require("@/lib/auth/guest")
  const raw = req.cookies.get("mb_guest")?.value ?? null
  const guestId = raw ? verifyGuestToken(raw) : null
  const ip = getClientIP(req)
  const ipHash = ip !== "unknown" ? hashIP(ip) : null
  return { guestId, ipHash }
}
