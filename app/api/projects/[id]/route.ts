import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getProjectWithAssets } from "@/lib/db/queries"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const project = await getProjectWithAssets(id)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (err) {
    console.error("[projects/get]", err)
    return NextResponse.json({ error: "Failed to load project" }, { status: 500 })
  }
}
