import { eq, desc } from "drizzle-orm"
import { getDb } from "./client"
import { users, projects, assets, type NewProject, type NewAsset } from "./schema"

// ── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(email: string, name?: string | null, avatar?: string | null) {
  const db = getDb()
  if (!db) return null

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (existing.length > 0) {
    // Update name/avatar on each login
    if (name || avatar) {
      await db.update(users).set({
        ...(name ? { name } : {}),
        ...(avatar ? { avatar } : {}),
        updatedAt: new Date(),
      }).where(eq(users.id, existing[0].id))
    }
    return existing[0]
  }

  const [user] = await db.insert(users).values({ email, name, avatar }).returning()
  return user
}

export async function getUserByEmail(email: string) {
  const db = getDb()
  if (!db) return null
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  return user ?? null
}

// ── Projects ─────────────────────────────────────────────────────────────────

export async function createProject(data: NewProject) {
  const db = getDb()
  if (!db) return null
  const [project] = await db.insert(projects).values(data).returning()
  return project
}

export async function getUserProjects(userId: string, limit = 20) {
  const db = getDb()
  if (!db) return []
  return db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt))
    .limit(limit)
}

export async function getProjectById(projectId: string) {
  const db = getDb()
  if (!db) return null
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)
  return project ?? null
}

export async function getProjectWithAssets(projectId: string) {
  const db = getDb()
  if (!db) return null
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)
  if (!project) return null
  const projectAssets = await db.select().from(assets).where(eq(assets.projectId, projectId))
  return { ...project, assets: projectAssets }
}

// ── Assets ───────────────────────────────────────────────────────────────────

export async function createAssets(data: NewAsset[]) {
  const db = getDb()
  if (!db) return []
  if (data.length === 0) return []
  return db.insert(assets).values(data).returning()
}

export async function getProjectAssets(projectId: string) {
  const db = getDb()
  if (!db) return []
  return db.select().from(assets).where(eq(assets.projectId, projectId))
}
