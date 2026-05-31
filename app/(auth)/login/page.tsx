import { LoginForm } from "@/components/auth/login-form"

export const metadata = { title: "Sign in — AI Memory Booth" }

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-2xl">📸</p>
          <h1 className="text-xl font-bold text-gray-900">Welcome to Memory Booth</h1>
          <p className="text-sm text-gray-400">Sign in to save your memories</p>
        </div>
        <LoginForm />
      </div>
      <p className="text-center text-xs text-gray-400 mt-6">
        3 free generations per day · No credit card required
      </p>
    </div>
  )
}
