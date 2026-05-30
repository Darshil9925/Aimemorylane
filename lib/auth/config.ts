// NextAuth config — filled in during Phase 5
export const authConfig = {
  providers: [], // Google, Apple, Email OTP
  callbacks: {},
  pages: {
    signIn: "/login",
    error: "/login",
  },
}
