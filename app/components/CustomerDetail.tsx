"use client";

import {
  Phone,
  MapPin,
  Package,
  Clock,
  AlertCircle,
  Heart,
  FileText,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  Timer,
  BadgeCheck,
  Clipboard,
  Map,
  Sun,
  Moon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

// --- TIPE DATA ---
interface OrderHistory {
  id: string;
  date: Date | string;
  status: string;
  note?: string | null;
  session: string;
  menu?: {
    name: string;
  } | null;
}

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: string;
  usedDays: number;
  createdAt: Date | string;

  package: {
    name: string;
    duration: number;
  };

  preferences: string | null;
  allergies: string | null;
  request?: string | null;

  // Array History Order (Dari Relasi Database)
  orders: OrderHistory[];
}

interface CustomerDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerData | null;
}

export default function CustomerDetail({
  open,
  onOpenChange,
  customer,
}: CustomerDetailProps) {
  if (!customer || !customer.package) return null;

  const totalDays = customer.package.duration;
  const packageName = customer.package.name;
  const progressPercent = (customer.usedDays / totalDays) * 100;

  // Helper Format Tanggal
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      weekday: "short", // Senin, Sel, Rab
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-3xl p-0 overflow-hidden flex flex-col focus:outline-none"
      >
        <SheetTitle className="sr-only">Detail {customer.name}</SheetTitle>

        {/* HEADER */}
        <div className="bg-pink-50 px-6 py-6 border-b border-pink-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                {customer.name}
              </h2>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
                <BadgeCheck className="w-3.5 h-3.5 shrink-0 text-green-700" />
                <span className="line-clamp-2">
                  Pelanggan Sejak {formatDate(customer.createdAt)}
                </span>
              </div>
            </div>
            <a
              href={`https://wa.me/${customer.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white p-2.5 rounded-full hover:bg-green-600 transition-colors shadow-sm shrink-0"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>

          {/* STATUS GRID */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white p-3.5 rounded-xl border border-pink-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  Paket
                </span>
              </div>
              <span className="text-sm font-bold text-gray-800 leading-tight block truncate">
                {packageName}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-pink-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  Progress
                </span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-sm font-bold text-gray-800 leading-tight">
                  Hari ke-{customer.usedDays}
                </span>
                <span className="text-[10px] text-gray-500 mb-0.5">
                  dari {totalDays}
                </span>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-pink-400"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="flex-1 overflow-y-auto bg-white px-6 py-6 space-y-8">
          {/* Section: Diet Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
              <Map className="w-4 h-4 text-gray-400" />
              Alamat Pelanggan
            </h3>
            <div className="grid gap-3">
              <div className="flex gap-3 bg-white p-3 rounded-xl border border-pink-400">
                <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase block mb-0.5">
                    Alamat
                  </span>
                  <p className="text-sm text-gray-700">
                    {customer.address || "- Alamat tidak tersedia -"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-white p-3 rounded-xl border border-pink-400">
                <Clipboard className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase block mb-0.5">
                    Catatan Alamat
                  </span>
                  <p className="text-sm text-gray-700">
                    {customer.request || "Tidak ada catatan tambahan."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Catatan Pelanggan
            </h3>
            <div className="grid gap-3">
              <div className="flex gap-3 bg-red-50 p-3 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase block mb-0.5">
                    Alergi / Pantangan
                  </span>
                  <p className="text-sm text-gray-700">
                    {customer.allergies || "- Tidak ada pantangan -"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <Heart className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase block mb-0.5">
                    Preferensi Makanan
                  </span>
                  <p className="text-sm text-gray-700">
                    {customer.preferences || "- Tidak ada preferensi khusus -"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Riwayat Pengiriman REAL */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              Riwayat Pengiriman
            </h3>

            {!customer.orders || customer.orders.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-xs text-gray-400">
                  Belum ada data riwayat log
                </p>
              </div>
            ) : (
              <div className="relative pl-4 border-l border-gray-100 space-y-6">
                {customer.orders.map((order) => {
                  // Logic Warna & Icon Status
                  let statusColor = "text-gray-400 bg-gray-100";
                  let StatusIcon = Timer;
                  let statusText = "Pending";

                  if (order.status === "cooking") {
                    statusColor = "text-orange-500 bg-orange-100";
                    StatusIcon = ChefHat;
                    statusText = "Dimasak";
                  } else if (order.status === "sent") {
                    statusColor = "text-green-500 bg-green-100";
                    StatusIcon = CheckCircle2;
                    statusText = "Dikirim";
                  }

                  // Logic Session (Lunch vs Dinner)
                  const isLunch = order.session === "LUNCH";

                  return (
                    <div key={order.id} className="relative group">
                      {/* Dot Timeline */}
                      <div
                        className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ring-1 ring-gray-200 ${
                          order.status === "sent"
                            ? "bg-green-400"
                            : "bg-gray-300"
                        }`}
                      />

                      <div className="flex flex-col gap-1">
                        {/* Row 1: Tanggal & Status */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            {formatDate(order.date)}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold ${statusColor}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusText}
                          </span>
                        </div>

                        {/* Row 2: Indikator Session (Lunch/Dinner) */}
                        <div className="flex items-center -mt-0.5 mb-1">
                          {isLunch ? (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                              <Sun className="w-3 h-3" /> Lunch
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                              <Moon className="w-3 h-3" /> Dinner
                            </div>
                          )}
                        </div>

                        {/* Row 3: Card Menu & Note */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <p className="text-sm font-bold text-gray-800">
                            {order.menu?.name || "Belum pilih menu"}
                          </p>
                          {order.note && (
                            <p className="text-xs text-orange-600 mt-1 italic flex items-start gap-1">
                              <span className="shrink-0 mt-0.5">*</span>{" "}
                              {order.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
