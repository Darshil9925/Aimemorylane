import Link from "next/link"
import { ProjectList } from "@/components/dashboard/project-list"

const modes = [
  {
    href: "/create/memory-pack",
    emoji: "✨",
    label: "Memory Pack",
    description: "Bundle a whole event — polaroids, strips, scrapbook, and more",
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    badge: "Most popular",
  },
  {
    href: "/create/photobooth",
    emoji: "🎞️",
    label: "Photobooth",
    description: "Vintage, Korean, Y2K, and Tokyo-style 4-panel strips",
    gradient: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    href: "/create/polaroid",
    emoji: "📷",
    label: "Polaroids",
    description: "Film grain, light leaks, and handwritten captions",
    gradient: "from-sky-400 to-blue-500",
    bg: "bg-sky-50",
    border: "border-sky-100",
  },
  {
    href: "/create/disposable",
    emoji: "📸",
    label: "Disposable Camera",
    description: "Kodak, Fujifilm, and party-flash vibes",
    gradient: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    href: "/create/scrapbook",
    emoji: "📒",
    label: "Scrapbook",
    description: "Handcrafted pages with tape, stickers, and maps",
    gradient: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good vibes only 👋</h1>
        <p className="text-gray-400 text-sm mt-1">What memory are we making today?</p>
      </div>

      {/* Mode cards */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Create
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modes.map((mode) => (
            <Link
              key={mode.href}
              href={mode.href}
              className={`group relative rounded-2xl border ${mode.border} ${mode.bg} p-5 hover:shadow-md transition-all active:scale-[0.98]`}
            >
              {mode.badge && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-violet-100 text-violet-600 text-[10px] font-bold tracking-wide">
                  {mode.badge}
                </span>
              )}
              <span className="text-2xl block mb-3">{mode.emoji}</span>
              <p className="font-semibold text-gray-800 mb-1">{mode.label}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{mode.description}</p>
              <span
                className={`mt-4 inline-block text-xs font-semibold text-white px-3 py-1.5 rounded-full bg-gradient-to-r ${mode.gradient}`}
              >
                Create →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent memories */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Recent memories
        </h2>
        <ProjectList />
      </section>
    </div>
  )
}
