"use client";

import { Search, Plus } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Category } from "@/lib/types";
import MenuForm from "./MenuForm";

interface MenuHeaderProps {
  search: string;
  setSearch: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  categories: Category[];
  isSheetOpen: boolean;
  setIsSheetOpen: (val: boolean) => void;
  onFormSubmit: (formData: FormData) => Promise<void>;
}

export default function MenuHeader({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories,
  isSheetOpen,
  setIsSheetOpen,
  onFormSubmit,
}: MenuHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-5 py-4 border-b border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Daftar Menu</h1>

        {/* ADD MENU SHEET WRAPPER */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="bg-pink-400 hover:bg-pink-500 text-white p-2 rounded-xl transition-colors shadow-lg shadow-pink-200">
              <Plus className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <MenuForm onSubmit={onFormSubmit} />
        </Sheet>
      </div>

      {/* SEARCH */}
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

      {/* FILTER CATEGORIES */}
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
  );
}