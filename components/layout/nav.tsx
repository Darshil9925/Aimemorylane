"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Home", emoji: "🏠" },
  { href: "/create/memory-pack", label: "Memory Pack", emoji: "✨" },
  { href: "/create/photobooth", label: "Photobooth", emoji: "🎞️" },
  { href: "/create/polaroid", label: "Polaroids", emoji: "📷" },
  { href: "/create/disposable", label: "Disposable", emoji: "📸" },
  { href: "/create/scrapbook", label: "Scrapbook", emoji: "📒" },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen border-r border-gray-100 bg-white px-3 py-6 fixed top-0 left-0">
        <Link href="/" className="px-3 mb-8 font-bold text-base tracking-tight">
          memory booth ✦
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative",
                    isActive
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-xl bg-gray-100"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Credits badge */}
        <div className="mx-2 p-3 rounded-2xl bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100">
          <p className="text-xs text-gray-500 mb-1">Free plan</p>
          <p className="text-sm font-semibold text-gray-800">3 / 3 memories left today</p>
          <Link href="/pricing" className="text-xs text-violet-500 font-medium mt-1 block hover:underline">
            Upgrade to Premium →
          </Link>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
                isActive ? "text-gray-900" : "text-gray-400"
              )}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-[9px] font-medium leading-none">{item.label.split(" ")[0]}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
