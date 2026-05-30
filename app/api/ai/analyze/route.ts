import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  // Phase 4: analyze photos, extract mood/faces/event type
  return NextResponse.json({ error: "Not implemented" }, { status: 501 })
}
