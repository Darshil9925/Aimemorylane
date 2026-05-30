import { useUserStore } from "@/store/user-store"

export function useCredits() {
  const { user, decrementCredits } = useUserStore()

  return {
    credits: user?.credits ?? 0,
    hasCredits: (cost = 1) => (user?.credits ?? 0) >= cost,
    spend: decrementCredits,
  }
}
