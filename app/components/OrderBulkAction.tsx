"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Coffee, Utensils } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "@/lib/order-types";

interface BulkActionsProps {
  selectedCount: number;
  session: string;
  menuList: Menu[];
  onSubmit: (menuId: string) => Promise<void>;
}

export default function BulkActions({
  selectedCount,
  session,
  menuList,
  onSubmit,
}: BulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(selectedMenuId);
    setIsSubmitting(false);
    setIsOpen(false);
    setSelectedMenuId("");
  };

  const filteredMenus = menuList.filter((m) => {
    if (!m.category) return true;
    const cat = m.category.toUpperCase();
    const currentSession = session.toUpperCase();

    if (cat === currentSession) return true;
    if (["JUICE", "SNACK", "ALL", "BEVERAGE"].includes(cat)) return true;
    return false;
  });

  if (selectedCount === 0) return null;

  return (
    <>
      {/* FLOATING BAR */}
      <div className="fixed bottom-24 left-5 right-5 z-30">
        <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-xl flex justify-between items-center animate-in slide-in-from-bottom-5">
          <div>
            <p className="text-xs text-gray-400 font-medium">Terpilih</p>
            <p className="font-bold text-lg">{selectedCount} Orang</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-pink-500/30 transition-all"
          >
            Atur Menu
          </button>
        </div>
      </div>

      {/* MENU SELECTOR SHEET */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl pb-8">
          <SheetHeader className="mb-5 text-left">
            <SheetTitle>Pilih Menu Massal</SheetTitle>
            <p className="text-sm text-gray-500">
              Akan diterapkan ke{" "}
              <span className="font-bold text-gray-800">
                {selectedCount} pelanggan
              </span>{" "}
              untuk sesi {session}.
            </p>
          </SheetHeader>

          <div className="space-y-4">
            <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 gap-2">
              {filteredMenus.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMenuId(m.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedMenuId === m.id
                      ? "bg-pink-50 border-pink-400 text-pink-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg ${
                        selectedMenuId === m.id ? "bg-pink-100" : "bg-gray-100"
                      }`}
                    >
                      {["JUICE", "BEVERAGE"].includes(
                        m.category?.toUpperCase()
                      ) ? (
                        <Coffee className="w-4 h-4" />
                      ) : (
                        <Utensils className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium block">
                        {m.name}
                      </span>
                      <span className="text-[10px] opacity-60 uppercase font-bold tracking-wide">
                        {m.category}
                      </span>
                    </div>
                  </div>

                  {selectedMenuId === m.id && (
                    <CheckCircle2 className="w-5 h-5 text-pink-500" />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedMenuId}
              className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Terapkan Menu"
              )}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
