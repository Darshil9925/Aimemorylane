import { create } from "zustand"
import type { Project, MemoryMode } from "@/types"

interface MemoryStore {
  currentProject: Project | null
  projects: Project[]
  activeMode: MemoryMode | null
  setCurrentProject: (p: Project | null) => void
  setActiveMode: (m: MemoryMode | null) => void
  addProject: (p: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
}

export const useMemoryStore = create<MemoryStore>((set) => ({
  currentProject: null,
  projects: [],
  activeMode: null,
  setCurrentProject: (p) => set({ currentProject: p }),
  setActiveMode: (m) => set({ activeMode: m }),
  addProject: (p) => set((s) => ({ projects: [p, ...s.projects] })),
  updateProject: (id, updates) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      currentProject: s.currentProject?.id === id ? { ...s.currentProject, ...updates } : s.currentProject,
    })),
}))
