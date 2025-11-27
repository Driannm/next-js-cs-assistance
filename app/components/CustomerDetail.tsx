"use client";

import { 
  Phone, 
  MapPin, 
  Package, 
  Clock, 
  AlertCircle, 
  Heart, 
  FileText,
  CalendarDays
} from "lucide-react";
import {
  Sheet, SheetContent, SheetTitle
} from "@/components/ui/sheet";

// UPDATE TIPE DATA (Sesuai Schema Prisma Baru)
interface CustomerData {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: string;
  usedDays: number;
  
  // Relasi ke Table Package (PENTING: Backend harus fetch pakai include: { package: true })
  package: {
    name: string;
    duration: number;
  };

  // Field Baru dari Schema
  preferences: string | null;
  allergies: string | null;
  
  // Asumsi field ini masih ada atau belum dihapus (dari kode sebelumnya)
  request?: string | null; 
}

interface CustomerDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerData | null;
}

export default function CustomerDetail({ open, onOpenChange, customer }: CustomerDetailProps) {
  if (!customer || !customer.package) return null; // Pastikan relasi package ada

  // Ambil data dari relasi Package
  const totalDays = customer.package.duration;
  const packageName = customer.package.name;

  // Hitung logic
  const remainingDays = totalDays - customer.usedDays;
  const progressPercent = (customer.usedDays / totalDays) * 100;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 overflow-hidden flex flex-col focus:outline-none">
        <SheetTitle className="sr-only">Detail {customer.name}</SheetTitle>

        {/* HEADER: Info Utama */}
        <div className="bg-pink-50 px-6 py-6 border-b border-pink-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 leading-tight">{customer.name}</h2>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-2">{customer.address}</span>
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
             {/* Info Paket (Ambil dari Relasi) */}
             <div className="bg-white p-3.5 rounded-xl border border-pink-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                    <Package className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Paket</span>
                </div>
                <span className="text-sm font-bold text-gray-800 leading-tight block truncate">
                  {packageName}
                </span>
             </div>
             
             {/* Info Progress */}
             <div className="bg-white p-3.5 rounded-xl border border-pink-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Progress</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-sm font-bold text-gray-800 leading-tight">
                     Hari ke-{customer.usedDays}
                  </span>
                  <span className="text-[10px] text-gray-500 mb-0.5">
                    dari {totalDays}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-pink-400" style={{ width: `${progressPercent}%` }} />
                </div>
             </div>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="flex-1 overflow-y-auto bg-white px-6 py-6 space-y-6">
          
          {/* Section: Preferensi & Alergi (Data Baru dari Schema) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
              Informasi Diet
            </h3>
            
            <div className="grid gap-3">
              {/* Alergi */}
              <div className="flex gap-3 bg-red-50 p-3 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase block mb-0.5">Alergi / Pantangan</span>
                  <p className="text-sm text-gray-700">
                    {customer.allergies || "- Tidak ada pantangan -"}
                  </p>
                </div>
              </div>

              {/* Preferensi */}
              <div className="flex gap-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <Heart className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase block mb-0.5">Preferensi Makanan</span>
                  <p className="text-sm text-gray-700">
                    {customer.preferences || "- Tidak ada preferensi khusus -"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Catatan Khusus */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Catatan Pengiriman
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed italic">
              "{customer.request || "Tidak ada catatan tambahan."}"
            </div>
          </div>

          {/* Section: Riwayat (Placeholder) */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              Riwayat Pengiriman
            </h3>
            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
               <p className="text-xs text-gray-400">Belum ada data riwayat log</p>
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}