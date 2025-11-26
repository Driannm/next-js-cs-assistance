"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" // Pastikan punya component UI Label shadcn
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false) // State untuk toggle password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget as HTMLFormElement
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Email atau password salah")
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none shadow-xl shadow-gray-100 rounded-3xl overflow-hidden">
        {/* Header Card digabung ke content agar lebih clean */}
        <CardContent className="p-8 pt-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Input Email */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-600 font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@catering.com"
                required
                className="h-11 rounded-xl border-gray-200 focus-visible:ring-pink-400"
              />
            </div>

            {/* Input Password dengan Toggle */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-600 font-medium">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-pink-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-11 rounded-xl bg-pink-400 hover:bg-pink-500 text-white font-bold shadow-md shadow-pink-200 transition-all active:scale-[0.98] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </Button>
            
            {/* Link Bantuan */}
            <div className="text-center text-sm">
              Lupa password?{" "}
              <a href="#" className="underline underline-offset-4 hover:text-pink-500 text-gray-500 transition-colors">
                Hubungi Suami ❤️
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}