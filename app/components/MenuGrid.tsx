"use client";

import Image from "next/image";
import { Edit3, Flame, Utensils } from "lucide-react";
import { Menu } from "@/lib/menu-types";

interface MenuGridProps {
  menus: Menu[];
  onSelect: (menu: Menu) => void;
}

export default function MenuGrid({ menus, onSelect }: MenuGridProps) {
  if (menus.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils className="w-8 h-8 opacity-30 text-pink-400" />
        </div>
        <p className="text-sm">Menu tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {menus.map((menu) => (
        <div
          key={menu.id}
          onClick={() => onSelect(menu)}
          className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-pink-200 transition-all flex flex-col cursor-pointer active:scale-[0.98]"
        >
          <div className="relative aspect-[4/3] bg-gray-200">
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
                {`${menu?.protein ?? 0}g`}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}