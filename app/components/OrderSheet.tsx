"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Truck,
  ChefHat,
  Save,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface OrderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
}

export default function OrderSheet({
  open,
  onOpenChange,
  order,
}: OrderSheetProps) {
  if (!order) return null;

  // State lokal untuk edit form
  const [note, setNote] = useState(order.note || "");
  const [selectedMenu, setSelectedMenu] = useState(order.menu);
  const [status, setStatus] = useState(order.status);

  // Dummy Menu Options untuk Dropdown
  const menuOptions = [
    "Ayam Bakar Madu",
    "Beef Blackpepper",
    "Salmon Teriyaki",
    "Shirataki Fried Rice",
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-8">
        <SheetHeader className="mb-5 text-left">
          <SheetTitle>Edit Pesanan</SheetTitle>
          <div className="text-sm text-gray-500">
            Pesanan untuk{" "}
            <span className="font-bold text-gray-800">
              {order.customerName}
            </span>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* 1. Ubah Menu */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Pilihan Menu
            </label>
            <div className="grid grid-cols-1 gap-2">
              {menuOptions.map((m) => (
                <div
                  key={m}
                  onClick={() => setSelectedMenu(m)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedMenu === m
                      ? "bg-pink-50 border-pink-400 text-pink-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium">{m}</span>
                  {selectedMenu === m && (
                    <CheckCircle2 className="w-5 h-5 text-pink-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. Catatan Khusus */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-1">
              Catatan Dapur{" "}
              <AlertTriangle className="w-3 h-3 text-orange-500" />
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm focus:outline-yellow-500 min-h-[80px]"
              placeholder="Contoh: Jangan pakai bawang goreng, alergi kacang..."
            />
          </div>

          {/* 3. Status Pesanan */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Status Pengiriman
            </label>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setStatus("pending")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  status === "pending"
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-400"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatus("cooking")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  status === "cooking"
                    ? "bg-white shadow text-orange-600"
                    : "text-gray-400"
                }`}
              >
                Masak
              </button>
              <button
                onClick={() => setStatus("sent")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  status === "sent"
                    ? "bg-white shadow text-green-600"
                    : "text-gray-400"
                }`}
              >
                Dikirim
              </button>
            </div>
          </div>

          {/* Tombol Simpan */}
          <button
            onClick={() => onOpenChange(false)}
            className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.95] transition-transform"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
