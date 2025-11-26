import { LoginForm } from "@/components/login-form";
import { ChefHat, UtensilsCrossed } from "lucide-react";

export default function Page() {
  return (
    // Background dengan gradient halus pink-ke-putih
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <div className="w-full max-w-sm flex flex-col gap-8">
        
        {/* Branding Section */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-400 text-white shadow-lg shadow-pink-200">
            <ChefHat className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              CS Catering App
            </h1>
            <p className="text-sm text-gray-500">
              Masuk untuk mengelola pesanan pelanggan
            </p>
          </div>
        </div>

        <LoginForm />
        
        {/* Footer simple */}
        <p className="text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Catering Sehat. All rights reserved.
        </p>
      </div>
    </div>
  )
}