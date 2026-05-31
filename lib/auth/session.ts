import { auth } from "@/auth"

/** Get the current session on the server. Returns null if unauthenticated. */
export async function getSession() {
  return auth()
}

/** Get the current user ID on the server. Returns null if unauthenticated. */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

/** Check if the current user is on a premium tier. */
export async function isPremiumUser(): Promise<boolean> {
  const session = await auth()
  // @ts-expect-error — tier is extended in auth.ts callbacks
  return session?.user?.tier === "premium"
}
