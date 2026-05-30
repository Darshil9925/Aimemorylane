"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    handle: "@priya.memories",
    avatar: "🧕",
    text: "literally crying at how good my bestie trip polaroids came out. feels like a real photo from 2004 🥹",
    tags: ["polaroid", "friend trip"],
  },
  {
    handle: "@jake.on.film",
    avatar: "🧑‍🎤",
    text: "used this for our concert photos and the disposable camera filter is UNREAL. people genuinely thought we shot on film",
    tags: ["disposable", "concert"],
  },
  {
    handle: "@maya.travels",
    avatar: "👩‍🦱",
    text: "uploaded 40 photos from Bali and got a full scrapbook in like 2 mins. i almost cried lol. worth every rupee",
    tags: ["memory pack", "travel"],
  },
  {
    handle: "@couples.era",
    avatar: "💑",
    text: "made an anniversary memory pack for my bf and he literally teared up. the love journal feature is so cute",
    tags: ["memory pack", "couple"],
  },
  {
    handle: "@syd.gram",
    avatar: "🧑‍🎨",
    text: "the Korean photobooth template is giving me actual sticker machine vibes. obsessed with this app fr",
    tags: ["photobooth", "korean"],
  },
  {
    handle: "@ravi.snaps",
    avatar: "📸",
    text: "honestly the AI captions are so good?? 'core memory unlocked' was perfect for our grad trip photos",
    tags: ["captions", "graduation"],
  },
]

const stats = [
  { value: "2M+", label: "Memories created" },
  { value: "400K+", label: "Happy users" },
  { value: "4.9★", label: "Average rating" },
  { value: "92%", label: "Share rate" },
]

export function SocialProof() {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold tracking-tight gradient-text">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            People are feeling it
          </h2>
          <p className="text-gray-400 text-lg">Real memories, real reactions.</p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.handle}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                  {t.avatar}
                </div>
                <span className="text-sm font-medium text-gray-700">{t.handle}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div className="flex flex-wrap gap-1.5">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-400 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
