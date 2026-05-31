import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  varchar,
  boolean,
} from "drizzle-orm/pg-core"

// ── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  username: text("username").unique(),
  avatar: text("avatar"),
  tier: varchar("tier", { length: 20 }).notNull().default("free"), // free | premium
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

// ── Projects (a "memory" the user created) ───────────────────────────────────

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  mode: varchar("mode", { length: 30 }).notNull(), // photobooth | polaroid | disposable | scrapbook | memory-pack
  status: varchar("status", { length: 20 }).notNull().default("completed"), // draft | processing | completed | failed
  title: text("title"),
  caption: text("caption"),
  dateStamp: text("date_stamp"),
  templateId: text("template_id"),    // which filter/template was used
  eventType: text("event_type"),      // for memory pack
  photoCount: integer("photo_count").notNull().default(0),
  metadata: jsonb("metadata"),        // AI analysis, story, etc.
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

// ── Generated Assets (output images from a project) ──────────────────────────

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 10 }).notNull().default("png"), // png | jpg | pdf
  url: text("url").notNull(),           // S3 URL or data URL for now
  thumbnailUrl: text("thumbnail_url"),
  width: integer("width"),
  height: integer("height"),
  filename: text("filename"),
  sizeBytes: integer("size_bytes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

// ── Type exports for use in app code ─────────────────────────────────────────

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Asset = typeof assets.$inferSelect
export type NewAsset = typeof assets.$inferInsert
