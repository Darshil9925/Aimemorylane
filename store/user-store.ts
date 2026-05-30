import { create } from "zustand"
import type { User } from "@/types"

interface UserStore {
  user: User | null
  isLoading: boolean
  setUser: (u: User | null) => void
  setLoading: (v: boolean) => void
  decrementCredits: (amount?: number) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (u) => set({ user: u, isLoading: false }),
  setLoading: (v) => set({ isLoading: v }),
  decrementCredits: (amount = 1) =>
    set((s) => ({
      user: s.user ? { ...s.user, credits: Math.max(0, s.user.credits - amount) } : null,
    })),
}))
