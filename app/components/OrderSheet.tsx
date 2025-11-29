"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Save,
  Loader2,
  Info,
  Utensils,
  Coffee,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { upsertOrder } from "@/app/actions/order";

interface OrderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  menuList: any[]; // Data Menu dari DB
  selectedDate: Date; // Tanggal yang sedang aktif
  onSuccess: () => void;
  session: "LUNCH" | "DINNER";
}

export default function OrderSheet({
  open,
  onOpenChange,
  order,
  session,
  menuList,
  selectedDate,
  onSuccess,
}: OrderSheetProps) {
  // State form
  const [note, setNote] = useState("");
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [status, setStatus] = useState("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form saat order berubah
  useEffect(() => {
    if (order) {
      setNote(order.note || "");
      setSelectedMenuId(order.menuId || "");
      setStatus(order.status || "pending");
    }
  }, [order]);

  if (!order) return null;

  async function handleSave() {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("customerId", order.customerId);
    formData.append("date", selectedDate.toISOString()); // Kirim tanggal
    formData.append("menuId", selectedMenuId);
    formData.append("note", note);
    formData.append("status", status);
    formData.append("session", session);

    try {
      await upsertOrder(formData);
      onSuccess(); // Tutup & Refresh
    } catch (error) {
      alert("Gagal menyimpan pesanan");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredMenus = menuList.filter((m: any) => {
    if (!m.category) return true; // Kalau ga ada kategori, tampilkan aja

    const cat = m.category.toUpperCase();
    const currentSession = session.toUpperCase(); // LUNCH / DINNER

    // Jika menu kategori-nya sama persis dengan sesi (Lunch == LUNCH) -> OK
    if (cat === currentSession) return true;

    // Menu kategori 'JUICE', 'SNACK', atau 'ALL' boleh muncul di sesi manapun
    if (["JUICE", "SNACK", "ALL", "BEVERAGE"].includes(cat)) return true;

    // Sisanya (misal kategori DINNER saat sesi LUNCH) -> Hide
    return false;
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl pb-8 max-h-[90vh] overflow-y-auto"
      >
        <SheetHeader className="mb-5 text-left">
          <SheetTitle>
            Edit Pesanan ({session === "LUNCH" ? "Siang" : "Malam"})
          </SheetTitle>
          <div className="text-sm text-gray-500">
            Pesanan untuk{" "}
            <span className="font-bold text-gray-800">
              {order.customerName}
            </span>
          </div>
        </SheetHeader>

        <div className="space-y-6 px-5">
          {/* Info Customer (Alergi/Preferensi) */}
          {(order.allergies || order.preferences) && (
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="text-xs text-blue-800">
                {order.allergies && (
                  <p>
                    <span className="font-bold">Alergi:</span> {order.allergies}
                  </p>
                )}
                {order.preferences && (
                  <p>
                    <span className="font-bold">Preferensi:</span>{" "}
                    {order.preferences}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 1. Pilih Menu */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide flex justify-between">
              <span>
                Pilihan Menu ({session === "LUNCH" ? "Siang" : "Malam"})
              </span>
              <span className="text-[10px] text-gray-400 font-normal">
                {filteredMenus.length} menu tersedia
              </span>
            </label>

            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1">
              {filteredMenus.length === 0 ? (
                <div className="text-center py-4 text-xs text-gray-400 border border-dashed rounded-xl">
                  Tidak ada menu khusus{" "}
                  {session === "LUNCH" ? "Siang" : "Malam"}
                </div>
              ) : (
                filteredMenus.map((m: any) => (
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
                      {/* Icon Pembeda Kategori (Opsional) */}
                      <div
                        className={`p-1.5 rounded-lg ${
                          selectedMenuId === m.id
                            ? "bg-pink-100"
                            : "bg-gray-100"
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
                        {/* Badge Kategori Kecil */}
                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-pink-400 uppercase font-bold">
                          {m.category}
                        </span>
                      </div>
                    </div>

                    {selectedMenuId === m.id && (
                      <CheckCircle2 className="w-5 h-5 text-pink-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Catatan */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-1">
              Catatan Dapur{" "}
              <AlertTriangle className="w-3 h-3 text-orange-500" />
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm focus:outline-yellow-500 min-h-[80px]"
              placeholder="Contoh: Jangan pakai bawang goreng..."
            />
          </div>

          {/* 3. Status (Hanya jika menu sudah dipilih) */}
          {selectedMenuId && (
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
          )}

          {/* Tombol Simpan */}
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.95] transition-transform disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
