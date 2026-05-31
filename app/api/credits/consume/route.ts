import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { consumeCredit, getIdentifiers } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id ?? null
    // @ts-expect-error — tier extended in auth callbacks
    const isPremium = session?.user?.tier === "premium"

    const { guestId, ipHash } = getIdentifiers(req)

    const result = await consumeCredit({ userId, guestId, ipHash, isPremium })

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: "rate_limit_exceeded",
          message: "You've used all 3 free generations for today. Upgrade to Premium for unlimited.",
          remaining: 0,
          resetAt: result.resetAt,
          upgradeUrl: "/pricing",
        },
        { status: 429 }
      )
    }

    return NextResponse.json({
      allowed: true,
      remaining: result.remaining,
      resetAt: result.resetAt,
    })
  } catch (err) {
    console.error("[credits/consume]", err)
    // Fail open — don't block users if rate limiter has an error
    return NextResponse.json({ allowed: true, remaining: 1, resetAt: "" })
  }
}
