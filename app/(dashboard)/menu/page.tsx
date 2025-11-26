"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Flame,
  Utensils,
  Edit3,
  Beef,
  Fish,
  Drumstick,
  LeafyGreen,
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

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // State untuk menyimpan menu yang sedang diklik
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  const categories = [
    { name: "All", label: "Semua", icon: Utensils },
    { name: "Chicken", label: "Unggas", icon: Drumstick },
    { name: "Beef", label: "Daging", icon: Beef },
    { name: "Seafood", label: "Seafood", icon: Fish },
    { name: "Veggie", label: "Sayuran", icon: LeafyGreen },
  ];

  const menus = [
    {
      id: 1,
      name: "Grilled Chicken Breast Sambal Matah",
      category: "Chicken",
      calories: 450,
      protein: "35g",
      description:
        "Dada ayam panggang tanpa minyak dengan sambal matah segar khas Bali + Nasi Merah.",
      image:
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      name: "Beef Blackpepper with Broccoli",
      category: "Beef",
      calories: 520,
      protein: "40g",
      description:
        "Daging sapi rendah lemak tumis lada hitam dengan brokoli rebus.",
      image:
        "https://images.unsplash.com/photo-1547496502-ffa2264a36b5?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      name: "Salmon Teriyaki Bowl",
      category: "Seafood",
      calories: 480,
      protein: "32g",
      description:
        "Ikan salmon panggang saus teriyaki low-sugar dengan edamame.",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      name: "Shirataki Fried Rice",
      category: "Veggie",
      calories: 250,
      protein: "12g",
      description: "Nasi goreng shirataki (0 karbo) dengan telur dan sayuran.",
      image:
        "https://images.unsplash.com/photo-1603133872878-684f108fd1f6?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const filteredMenus = menus.filter((menu) => {
    const matchSearch = menu.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || menu.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* 1. Header Sticky */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-5 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Daftar Menu</h1>

          {/* Tombol Tambah Menu (Sheet Add Menu) */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="bg-pink-400 hover:bg-pink-500 text-white p-2 rounded-xl transition-colors shadow-lg shadow-pink-200">
                <Plus className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl pb-10 h-[85vh]">
              <SheetHeader className="mb-5">
                <SheetTitle>Tambah Menu Baru</SheetTitle>
              </SheetHeader>
              
              {/* --- Isi Form Tambah Menu (Sama seperti sebelumnya) --- */}
              <div className="space-y-4 overflow-y-auto max-h-[70vh] px-1">
                <div className="h-40 w-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-pink-300 hover:text-pink-400 transition-colors">
                  <Utensils className="w-8 h-8 mb-2" />
                  <span className="text-xs">Upload Foto Makanan</span>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Nama Menu</label>
                  <input type="text" className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400" placeholder="Contoh: Ayam Bakar Madu" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500">Kalori (Kcal)</label>
                    <input type="number" className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400" placeholder="400" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500">Protein (gr)</label>
                    <input type="text" className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400" placeholder="30g" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Deskripsi</label>
                  <textarea className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400 h-24 resize-none" placeholder="Deskripsi bahan dan rasa..." />
                </div>
                <button className="w-full bg-pink-400 text-white font-bold py-3 rounded-xl">Simpan Menu</button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search Bar */}
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

        {/* Category Pills */}
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

      {/* 2. Menu Grid */}
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
                onClick={() => setSelectedMenu(menu)} // <--- Tambahkan Event Click di sini
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-pink-200 transition-all flex flex-col cursor-pointer active:scale-[0.98]"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] bg-gray-200">
                  <Image
                    src={menu.image}
                    alt={menu.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-md text-gray-700 shadow-sm">
                    {menu.category}
                  </span>
                  {/* Edit Button hidden, muncul pas di hover */}
                  <button className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-gray-600 hover:text-pink-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-1">
                      {menu.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                      {menu.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                      <Flame className="w-3 h-3" />
                      {menu.calories}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                      <span className="text-[9px]">PRO</span>
                      {menu.protein}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Render Component Detail Popup */}
      <MenuDetail 
        open={!!selectedMenu} 
        onOpenChange={() => setSelectedMenu(null)} 
        menu={selectedMenu} 
      />

    </div>
  );
}