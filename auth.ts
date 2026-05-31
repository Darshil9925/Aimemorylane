import NextAuth, { type NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import { Redis } from "@upstash/redis"

// Reuse the same Upstash Redis we use for rate limiting.
// The adapter stores NextAuth users, accounts, and email verification tokens.
// This lets email magic links work WITHOUT a Postgres database (Phase 5B).
const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
const hasRedis = Boolean(redisUrl && redisToken)

const redis = hasRedis
  ? new Redis({ url: redisUrl!, token: redisToken! })
  : null

// Providers — email magic link only included when Redis is available,
// because the email flow requires an adapter to persist verification tokens.
const providers: NextAuthConfig["providers"] = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
]

if (hasRedis && process.env.RESEND_API_KEY) {
  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    })
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: redis ? UpstashRedisAdapter(redis) : undefined,
  providers,

  // JWT sessions even with an adapter — OAuth stays stateless,
  // the adapter is used only for user records + email verification tokens.
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id
      if (!token.tier) token.tier = "free"
      return token
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      // @ts-expect-error — extending default session type
      session.user.tier = token.tier ?? "free"
      return session
    },
  },
})
