import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getRemainingCredits, getIdentifiers } from "@/lib/rate-limit"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id ?? null
    const userEmail = session?.user?.email ?? null
    // @ts-expect-error — tier extended in auth callbacks
    const isPremium = session?.user?.tier === "premium"

    const { guestId } = getIdentifiers(req)

    const result = await getRemainingCredits({ userId, userEmail, guestId, isPremium })

    return NextResponse.json({
      ...result,
      isAuthenticated: !!userId,
      isPremium,
      remaining: result.remaining === Infinity ? null : result.remaining,
    })
  } catch (err) {
    console.error("[credits/remaining]", err)
    return NextResponse.json({ remaining: 3, total: 3, isAuthenticated: false, isPremium: false })
  }
}
