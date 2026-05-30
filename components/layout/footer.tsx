import Link from "next/link"

const links = {
  Product: ["Photobooth", "Polaroids", "Disposable Camera", "Scrapbook", "Memory Pack"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
}

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-bold text-lg tracking-tight mb-3">memory booth ✦</p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Turn your camera roll into memories that feel physical, nostalgic, and worth sharing.
            </p>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {group}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} AI Memory Booth. Made with love.
          </p>
          <div className="flex items-center gap-6">
            {["Instagram", "TikTok", "Twitter"].map((s) => (
              <Link
                key={s}
                href="#"
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
