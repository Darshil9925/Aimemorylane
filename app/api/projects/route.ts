import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createProject, createAssets, getUserProjects, upsertUser } from "@/lib/db/queries"

/** GET /api/projects — list current user's projects */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ projects: [], isAuthenticated: false })
    }

    const user = await upsertUser(session.user.email, session.user.name, session.user.image)
    if (!user) return NextResponse.json({ projects: [], dbUnavailable: true })

    const userProjects = await getUserProjects(user.id)
    return NextResponse.json({ projects: userProjects, isAuthenticated: true })
  } catch (err) {
    console.error("[projects/list]", err)
    return NextResponse.json({ projects: [], error: "Failed to load projects" })
  }
}

/** POST /api/projects — save a completed generation */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Sign in to save memories" }, { status: 401 })
    }

    const user = await upsertUser(session.user.email, session.user.name, session.user.image)
    if (!user) {
      // No database — return a mock success so the app doesn't break
      return NextResponse.json({ saved: false, dbUnavailable: true })
    }

    const body = await req.json()
    const { mode, title, caption, dateStamp, templateId, eventType, photoCount, metadata, assets: assetUrls } = body

    const project = await createProject({
      userId: user.id,
      mode,
      status: "completed",
      title: title || `${mode} · ${new Date().toLocaleDateString()}`,
      caption,
      dateStamp,
      templateId,
      eventType,
      photoCount: photoCount ?? 0,
      metadata: metadata ?? null,
    })

    if (!project) {
      return NextResponse.json({ saved: false })
    }

    // Save assets if provided (data URLs for now, S3 URLs in Phase 5C)
    if (assetUrls?.length > 0) {
      const assetRecords = assetUrls.map((url: string, i: number) => ({
        projectId: project.id,
        type: "png" as const,
        url,
        filename: `${mode}-${templateId ?? "default"}-${i + 1}.png`,
      }))
      await createAssets(assetRecords)
    }

    return NextResponse.json({ saved: true, projectId: project.id })
  } catch (err) {
    console.error("[projects/create]", err)
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 })
  }
}
