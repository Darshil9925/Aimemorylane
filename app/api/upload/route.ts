import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  // Phase 5: validate auth, upload to S3, return URLs
  return NextResponse.json({ error: "Not implemented" }, { status: 501 })
}
