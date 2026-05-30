import { DashboardNav } from "@/components/layout/nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      {/* Offset for desktop sidebar */}
      <main className="md:ml-56 max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}
