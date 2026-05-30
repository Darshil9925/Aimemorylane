import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "AI Memory Booth — Turn Your Camera Roll Into Memories",
  description:
    "Create photobooth strips, polaroids, disposable camera photos, scrapbook pages, and memory packs from your photos in seconds.",
  openGraph: {
    title: "AI Memory Booth",
    description: "Turn your camera roll into memories",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">{children}</body>
    </html>
  )
}
