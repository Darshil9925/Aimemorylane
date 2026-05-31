import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? "memory@aimemorybooth.app",
    }),
  ],

  // JWT strategy — no database needed for Phase 5A
  // Swap to database adapter in Phase 5B
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id
      // Attach subscription tier — default free
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
