"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <Link href="/" className="font-bold text-lg tracking-tight">
        memory booth ✦
      </Link>
      <nav className="flex items-center gap-3">
        <Link href="/login">
          <Button variant="ghost" size="sm">Sign in</Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">Get started</Button>
        </Link>
      </nav>
    </header>
  )
}
