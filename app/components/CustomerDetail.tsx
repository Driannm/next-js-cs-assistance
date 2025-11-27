"use client";

import { 
  Phone, CalendarDays, MapPin, Package, Clock 
} from "lucide-react";
import {
  Sheet, SheetContent, SheetTitle
} from "@/components/ui/sheet";

interface CustomerDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: any; // Menggunakan 'any' sementara, idealnya pakai Type Prisma
}

export default function CustomerDetail({ open, onOpenChange, customer }: CustomerDetailProps) {
  if (!customer) return null;

  // Hitung sisa hari
  const remainingDays = customer.totalDays - customer.usedDays;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0 overflow-hidden flex flex-col focus:outline-none">
        <SheetTitle className="sr-only">Detail {customer.name}</SheetTitle>

        {/* Header Background */}
        <div className="bg-pink-50 px-6 py-6 border-b border-pink-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
              <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{customer.address}</span>
              </div>
            </div>
            <a 
              href={`https://wa.me/${customer.phone}`}
              target="_blank"
              className="bg-green-500 text-white p-2.5 rounded-full hover:bg-green-600 transition-colors shadow-sm"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-3 mt-4">
             <div className="bg-white p-3 rounded-xl border border-pink-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                    <Package className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Paket</span>
                </div>
                <span className="text-sm font-bold text-gray-800 leading-tight block truncate">
                  {customer.packageType}
                </span>
             </div>
             <div className="bg-white p-3 rounded-xl border border-pink-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Sisa Hari</span>
                </div>
                <span className="text-sm font-bold text-gray-800 leading-tight block">
                   {remainingDays} Hari Lagi
                </span>
             </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto bg-white px-6 py-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-pink-500" />
            Riwayat Pesanan
          </h3>
            
          <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
             <p className="text-xs text-gray-400">Belum ada history pesanan</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}