// app/(dashboard)/menu/menu-client.tsx
"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Flame,
  Utensils,
  Edit3,
  Beef,
  Milk,
  Drumstick,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import MenuDetail from "@/app/components/MenuDetail"; 
import { createMenu } from "@/app/actions/menu";

// Definisikan Tipe Data dari Prisma
type Menu = {
  id: string;
  name: string;
  category: string;
  calories: number | null;
  protein: string | null;
  description: string | null;
  image: string | null;
  ingredients: string | null;
};

export default function MenuClient({ initialMenus }: { initialMenus: Menu[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State untuk menutup sheet setelah submit

  const categories = [
    { name: "All", label: "Semua", icon: Utensils },
    { name: "Lunch", label: "Lunch", icon: Drumstick },
    { name: "Dinner", label: "Dinner", icon: Beef },
    { name: "Juice", label: "Juice", icon: Milk },
  ];

  // Filter Logic pada data asli dari Database
  const filteredMenus = initialMenus.filter((menu) => {
    const matchSearch = menu.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || menu.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Handle Submit Form
  async function handleSubmit(formData: FormData) {
    await createMenu(formData); // Panggil Server Action
    setIsSheetOpen(false); // Tutup drawer
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-5 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Daftar Menu</h1>

          {/* ADD MENU SHEET */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="bg-pink-400 hover:bg-pink-500 text-white p-2 rounded-xl transition-colors shadow-lg shadow-pink-200">
                <Plus className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="rounded-t-3xl pb-10 h-[85vh] px-5"
            >
              <SheetHeader className="mb-5">
                <SheetTitle>Tambah Menu Baru</SheetTitle>
              </SheetHeader>

              {/* FORM DENGAN SERVER ACTION */}
              <form
                action={handleSubmit}
                className="space-y-4 overflow-y-auto max-h-[70vh] px-1"
              >
                {/* Image Placeholder */}
                <div className="h-40 w-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                  <Utensils className="w-8 h-8 mb-2" />
                  <span className="text-xs">Upload Foto (Auto Default)</span>
                </div>

                {/* Input Fields (Wajib ada 'name' agar terbaca di FormData) */}
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Nama Menu
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
                    placeholder="Contoh: Ayam Bakar Madu"
                  />
                </div>

                {/* Dropdown Category Simple */}
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Kategori
                  </label>
                  <select
                    name="category"
                    className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
                  >
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Juice">Juice</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500">
                      Kalori (Kcal)
                    </label>
                    <input
                      name="calories"
                      type="number"
                      className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
                      placeholder="400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500">
                      Protein (gr)
                    </label>
                    <input
                      name="protein"
                      type="text"
                      className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
                      placeholder="30g"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500">
                      Lemak (fat)
                    </label>
                    <input
                      name="fat"
                      type="text"
                      className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
                      placeholder="30g"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400 h-24 resize-none"
                    placeholder="Deskripsi bahan dan rasa..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-400 text-white font-bold py-3 rounded-xl hover:bg-pink-500 transition-colors"
                >
                  Simpan Menu
                </button>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {/* SEARCH & FILTER UI (Sama seperti sebelumnya) */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari menu diet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all outline-none"
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                  active
                    ? "bg-pink-400 text-white border-pink-400 shadow-md shadow-pink-200"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* MENU GRID */}
      <div className="px-5 py-4">
        {filteredMenus.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 opacity-30" />
            </div>
            <p className="text-sm">Menu tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredMenus.map((menu) => (
              <div
                key={menu.id}
                onClick={() => setSelectedMenu(menu)}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-pink-200 transition-all flex flex-col cursor-pointer active:scale-[0.98]"
              >
                <div className="relative aspect-[4/3] bg-gray-200">
                  {/* Gunakan placeholder jika image null */}
                  <Image
                    src={
                      menu.image ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
                    }
                    alt={menu.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-md text-gray-700 shadow-sm">
                    {menu.category}
                  </span>
                  <button className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-gray-600 hover:text-pink-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-1">
                      {menu.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                      {menu.description || "Tidak ada deskripsi"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                      <Flame className="w-3 h-3" />
                      {menu.calories || 0}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                      <span className="text-[9px]">PRO</span>
                      {menu.protein || "0g"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MenuDetail
        open={!!selectedMenu}
        onOpenChange={() => setSelectedMenu(null)}
        menu={selectedMenu}
      />
    </div>
  );
}
