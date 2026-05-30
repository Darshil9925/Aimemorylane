export type UserRole = "free" | "premium" | "admin"

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar?: string
  credits: number
  role: UserRole
  subscriptionStatus: "active" | "inactive" | "trialing" | null
  createdAt: Date
}

export interface UserProfile extends User {
  projectCount: number
}
