"use client"

import { useState, useEffect, useCallback } from "react"

interface CreditsState {
  remaining: number | null  // null = unlimited (premium)
  total: number
  isAuthenticated: boolean
  isPremium: boolean
  resetAt: string
  isLoading: boolean
}

const DEFAULT: CreditsState = {
  remaining: 3,
  total: 3,
  isAuthenticated: false,
  isPremium: false,
  resetAt: "",
  isLoading: true,
}

export function useCredits() {
  const [state, setState] = useState<CreditsState>(DEFAULT)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [upgradeResetAt, setUpgradeResetAt] = useState<string | undefined>()

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/credits/remaining")
      if (!res.ok) return
      const data = await res.json()
      setState({ ...data, isLoading: false })
    } catch {
      setState((s) => ({ ...s, isLoading: false }))
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  /**
   * Call this BEFORE starting any generation.
   * Returns true if the generation may proceed, false if rate-limited.
   */
  const consumeCredit = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/credits/consume", { method: "POST" })
      const data = await res.json()

      if (res.status === 429) {
        setUpgradeResetAt(data.resetAt)
        setShowUpgrade(true)
        return false
      }

      // Update remaining count
      setState((s) => ({
        ...s,
        remaining: data.remaining === null ? null : data.remaining,
      }))
      return true
    } catch {
      // Fail open — never block user due to network error
      return true
    }
  }, [])

  return {
    ...state,
    consumeCredit,
    showUpgrade,
    upgradeResetAt,
    closeUpgrade: () => setShowUpgrade(false),
    refresh,
  }
}
