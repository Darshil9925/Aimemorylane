import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { newGuestToken, GUEST_COOKIE, verifyGuestToken } from "@/lib/auth/guest"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Issue a guest token if the user doesn't have one yet
  const existing = request.cookies.get(GUEST_COOKIE.name)?.value
  const valid = existing ? verifyGuestToken(existing) : null

  if (!valid) {
    const token = newGuestToken()
    response.cookies.set({
      name: GUEST_COOKIE.name,
      value: token,
      maxAge: GUEST_COOKIE.maxAge,
      httpOnly: GUEST_COOKIE.httpOnly,
      secure: GUEST_COOKIE.secure,
      sameSite: GUEST_COOKIE.sameSite,
      path: GUEST_COOKIE.path,
    })
  }

  return response
}

export const config = {
  // Run on all routes except static assets, images, and NextAuth internals
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
}
