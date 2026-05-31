"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { EmptyState } from "@/components/shared/empty-state"

interface ProjectCard {
  id: string
  mode: string
  title: string | null
  templateId: string | null
  photoCount: number
  createdAt: string
}

const MODE_EMOJI: Record<string, string> = {
  photobooth: "🎞️",
  polaroid: "📷",
  disposable: "📸",
  scrapbook: "📒",
  "memory-pack": "✨",
}

const MODE_COLOR: Record<string, string> = {
  photobooth: "bg-amber-50 border-amber-100",
  polaroid: "bg-sky-50 border-sky-100",
  disposable: "bg-rose-50 border-rose-100",
  scrapbook: "bg-emerald-50 border-emerald-100",
  "memory-pack": "bg-violet-50 border-violet-100",
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export function ProjectList() {
  const [projects, setProjects] = useState<ProjectCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects ?? [])
        setIsAuthenticated(data.isAuthenticated ?? false)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <EmptyState
        icon="🔒"
        title="Sign in to see your memories"
        description="Your generated memories will appear here after you sign in."
        action={
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Sign in
          </Link>
        }
      />
    )
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No memories yet"
        description="Upload some photos and create your first memory above."
      />
    )
  }

  return (
    <div className="space-y-2">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link
            href={`/projects/${project.id}`}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm active:scale-[0.99] ${
              MODE_COLOR[project.mode] ?? "bg-gray-50 border-gray-100"
            }`}
          >
            <span className="text-2xl">{MODE_EMOJI[project.mode] ?? "✨"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {project.title || `${project.mode} memory`}
              </p>
              <p className="text-xs text-gray-400">
                {project.photoCount} photo{project.photoCount !== 1 ? "s" : ""} · {timeAgo(project.createdAt)}
              </p>
            </div>
            <span className="text-gray-300 text-sm">→</span>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
