import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <main className="flex flex-col items-center text-center max-w-xl w-full gap-10 py-20">
        
        <div className="flex flex-col gap-4">
          <Image
            src="/images/cs-assistance-light.webp"
            alt="App Logo"
            width={140}
            height={140}
            className="mx-auto"
          />

          <h1 className="text-4xl font-semibold text-zinc-900 leading-snug">
            CS Assistance Web App
          </h1>

          <p className="text-lg text-zinc-600 leading-relaxed">
            Solusi cepat dan efisien untuk membantu tim customer service Anda
            bekerja lebih produktif.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-full bg-black text-white font-medium hover:opacity-80 transition-all"
          >
            Login
          </Link>
        </div>

        <Footer />
      </main>
    </div>
  );
}