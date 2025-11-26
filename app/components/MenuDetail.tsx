"use client";

import { Flame, Edit3, ChevronDown, UtensilsCrossed, Droplets } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Image from "next/image";

interface MenuDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu: any;
}

export default function MenuDetail({ open, onOpenChange, menu }: MenuDetailProps) {
  if (!menu) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0 overflow-hidden flex flex-col border-none focus:outline-none">
        
        {/* Perbaikan: Menggunakan class 'sr-only' bawaan Tailwind, tidak perlu library tambahan */}
        <SheetTitle className="sr-only">Detail Menu {menu.name}</SheetTitle>

        {/* Bagian Gambar (Hero) */}
        <div className="relative h-72 w-full shrink-0">
          <Image 
            src={menu.image} 
            alt={menu.name} 
            fill 
            className="object-cover" 
            priority
          />
          
          {/* Tombol Tutup Custom */}
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/40 transition-colors z-10"
          >
              <ChevronDown className="w-6 h-6" />
          </button>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6">
             <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-2 inline-block shadow-sm">
                {menu.category}
             </span>
             <h2 className="text-2xl font-bold text-white leading-tight shadow-sm">
                {menu.name}
             </h2>
          </div>
        </div>

        {/* Konten Scrollable */}
        <div className="flex-1 overflow-y-auto bg-white -mt-6 relative z-10 rounded-t-3xl px-6 pt-8 pb-10">
          
          {/* Indikator Geser */}
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 absolute top-3 left-1/2 -translate-x-1/2" />

          {/* Informasi Makro (Cards) */}
          <div className="grid grid-cols-3 gap-3 mb-8">
              {/* Kalori */}
              <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100 flex flex-col items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-orange-500" />
                <div className="text-center">
                    <span className="block text-lg font-bold text-gray-800 leading-none">{menu.calories}</span>
                    <span className="text-[10px] text-gray-500 font-medium">Kcal</span>
                </div>
              </div>
              
              {/* Protein */}
              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex flex-col items-center justify-center gap-1">
                <UtensilsCrossed className="w-5 h-5 text-blue-500" />
                <div className="text-center">
                    <span className="block text-lg font-bold text-gray-800 leading-none">{menu.protein}</span>
                    <span className="text-[10px] text-gray-500 font-medium">Protein</span>
                </div>
              </div>

              {/* Lemak */}
              <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-100 flex flex-col items-center justify-center gap-1">
                <Droplets className="w-5 h-5 text-yellow-500" />
                <div className="text-center">
                    <span className="block text-lg font-bold text-gray-800 leading-none">12g</span>
                    <span className="text-[10px] text-gray-500 font-medium">Lemak</span>
                </div>
              </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">Tentang Menu</h3>
              <p className="text-sm text-gray-600 leading-relaxed text-justify">
                {menu.description} Menu ini dirancang khusus untuk memenuhi kebutuhan nutrisi harian dengan rasa yang tetap lezat. Menggunakan bahan-bahan segar pilihan.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3">Komposisi Utama</h3>
              <div className="flex flex-wrap gap-2">
                  {["Bawang Putih", "Garam Himalaya", "Minyak Zaitun", "Lada Hitam"].map((ing, i) => (
                    <span key={i} className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                      {ing}
                    </span>
                  ))}
              </div>
            </div>
          </div>

        </div>

        {/* Floating Action Button (Sticky Bottom) */}
        <div className="bg-white p-5 border-t border-gray-100 sticky bottom-0 z-20">
            <button className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform">
            <Edit3 className="w-4 h-4" />
            Edit Menu Ini
            </button>
        </div>

      </SheetContent>
    </Sheet>
  );
}