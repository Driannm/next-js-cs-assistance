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
  customer: any;
}

export default function CustomerDetail({ open, onOpenChange, customer }: CustomerDetailProps) {
  if (!customer) return null;

  // Simulasi data jadwal (karena di dummy data parent belum tentu lengkap)
  const dummySchedule = [
    { day: "Senin", date: "20 Nov", menu: customer.lastMenu || "Ayam Bakar", status: "Terkirim" },
    { day: "Selasa", date: "21 Nov", menu: "Beef Teriyaki", status: "Proses" },
    { day: "Rabu", date: "22 Nov", menu: "Ikan Asam Manis", status: "Pending" },
    { day: "Kamis", date: "23 Nov", menu: "-", status: "Belum Pilih" },
    { day: "Jumat", date: "24 Nov", menu: "Skip", status: "Libur" },
  ];

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
                <span className="text-sm font-bold text-gray-800 leading-tight block">
                  {customer.package}
                </span>
             </div>
             <div className="bg-white p-3 rounded-xl border border-pink-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Sisa Hari</span>
                </div>
                <span className="text-sm font-bold text-gray-800 leading-tight block">
                   {customer.progress.total - customer.progress.current} Hari Lagi
                </span>
             </div>
          </div>
        </div>

        {/* Body Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto bg-white px-6 py-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-pink-500" />
            Jadwal Minggu Ini
          </h3>

          <div className="space-y-0 relative border-l border-gray-100 ml-2">
            {dummySchedule.map((item, idx) => (
              <div key={idx} className="mb-6 ml-6 relative">
                {/* Dot Connector */}
                <div className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                    item.status === 'Terkirim' ? 'bg-pink-400' : 'bg-gray-300'
                }`} />
                
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-xs text-gray-400 font-medium block mb-0.5">{item.day}, {item.date}</span>
                        <span className={`text-sm font-bold block ${item.menu === 'Skip' ? 'text-red-400 italic' : 'text-gray-800'}`}>
                            {item.menu}
                        </span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        item.status === 'Terkirim' ? 'bg-green-100 text-green-600' :
                        item.status === 'Proses' ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-gray-100 text-gray-400'
                    }`}>
                        {item.status}
                    </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}