import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

/**
 * Neon serverless driver — each call opens a single HTTP request to the database.
 * No persistent connections, no pool management, ideal for Vercel serverless.
 *
 * When DATABASE_URL is not set, returns null so callers can fall back gracefully.
 */
export function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) return null

  const sql = neon(url)
  return drizzle(sql, { schema })
}

export type Db = NonNullable<ReturnType<typeof getDb>>
