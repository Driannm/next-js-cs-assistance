import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import { ArrowRight, ChefHat } from "lucide-react";

export default function Home() {
  return (
    // Container utama dengan gradient background sesuai tema aplikasi
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-pink-50 via-white to-pink-100/50">
      
      {/* Konten Utama (Tengah) */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Logo Section */}
          <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-xl shadow-pink-100 ring-1 ring-gray-100">
            {/* Jika gambar ada, gunakan Image. Jika belum, pakai Icon sebagai placeholder */}
            <Image
              src="/images/cs-assistance-light.webp"
              alt="App Logo"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
            {/* Fallback Icon jika gambar tidak muncul (opsional, bisa dihapus) */}
            {/* <ChefHat className="h-16 w-16 text-pink-400" /> */}
          </div>

          {/* Text Section */}
          <div className="space-y-4">
            <span className="inline-block rounded-full bg-pink-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-pink-600">
              Internal System v1.0
            </span>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl leading-tight">
              CS Assistance <br/>
              <span className="text-pink-500">Web App</span>
            </h1>

            <p className="mx-auto max-w-lg text-lg text-gray-500 leading-relaxed">
              Solusi efisien untuk membantu tim Customer Service mengelola pelanggan, 
              pesanan, dan menu katering harian dengan lebih produktif.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-pink-500 hover:shadow-pink-300 hover:-translate-y-1 active:scale-95"
            >
              Masuk Aplikasi
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer (Menempel di bawah) */}
      <div className="py-6">
        <Footer />
      </div>
    </div>
  );
}