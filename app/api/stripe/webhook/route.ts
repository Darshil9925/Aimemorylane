import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  // Phase 5: handle Stripe webhooks
  return NextResponse.json({ received: true })
}
