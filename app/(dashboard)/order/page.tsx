"use client";

import { useState } from "react";
import { 
  ChevronLeft, ChevronRight, CalendarDays, 
  ChefHat, Truck, MapPin, Search, 
  AlertCircle,
  MoreHorizontal
} from "lucide-react";
import OrderSheet from "@/app/components/OrderSheet";

export default function OrderPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"ready" | "missing">("ready");

  // Format Tanggal: "Selasa, 24 Nov"
  const formattedDate = selectedDate.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "short"
  });

  // Dummy Data Order
  const orders = [
    {
      id: "ORD-001",
      customerName: "Siska Kohl",
      address: "Jl. Sultan Agung No. 10 (Pagar Hitam)",
      menu: "Ayam Bakar Madu",
      note: "Jangan pedas ya kak",
      status: "cooking", // pending, cooking, sent
      type: "ready"
    },
    {
      id: "ORD-002",
      customerName: "Budi Santoso",
      address: "Green Garden Blok A",
      menu: "Beef Blackpepper",
      note: "",
      status: "sent",
      type: "ready"
    },
    {
      id: "ORD-003",
      customerName: "Ani Wijaya",
      address: "Apartemen Mediterania",
      menu: "Ayam Bakar Madu",
      note: "",
      status: "pending",
      type: "ready"
    },
    // Pelanggan yang belum pilih menu
    {
      id: "ORD-004",
      customerName: "Joko Anwar",
      address: "Jl. Kemang Raya",
      menu: null, // Belum pilih
      status: "pending",
      type: "missing"
    }
  ];

  // Filter Logic berdasarkan Tab
  const displayedOrders = orders.filter(o => 
    activeTab === "ready" ? o.menu !== null : o.menu === null
  );

  // Rekap Kitchen (Hitung jumlah porsi per menu)
  // Logic: Ambil semua order 'ready', group by menu, count.
  const kitchenRecap = orders
    .filter(o => o.menu)
    .reduce((acc: any, curr) => {
        const menu = curr.menu as string;
        acc[menu] = (acc[menu] || 0) + 1;
        return acc;
    }, {});

  // Function ganti hari
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* 1. Header Sticky: Tanggal & Navigasi */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-5 py-4 flex items-center justify-between">
            <button onClick={() => changeDate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
                <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Jadwal Pengiriman</p>
                <h2 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
                    <CalendarDays className="w-4 h-4 text-pink-500" />
                    {formattedDate}
                </h2>
            </div>

            <button onClick={() => changeDate(1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600">
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex px-5 pb-0">
            <button 
                onClick={() => setActiveTab("ready")}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "ready" ? "border-pink-500 text-pink-500" : "border-transparent text-gray-400"
                }`}
            >
                Siap Kirim ({orders.filter(o => o.menu).length})
            </button>
            <button 
                onClick={() => setActiveTab("missing")}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "missing" ? "border-pink-500 text-pink-500" : "border-transparent text-gray-400"
                }`}
            >
                Belum Pilih ({orders.filter(o => !o.menu).length})
            </button>
        </div>
      </header>

      {/* 2. Content Area */}
      <div className="px-5 py-5 space-y-6">

        {/* Section: Kitchen Recap (Hanya muncul di Tab Ready) */}
        {activeTab === "ready" && (
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    Rekap Dapur Hari Ini
                </h3>
                <div className="space-y-2">
                    {Object.entries(kitchenRecap).map(([menuName, count]: any) => (
                        <div key={menuName} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                            <span className="text-sm font-medium text-gray-700">{menuName}</span>
                            <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2.5 py-1 rounded-lg">
                                {count} Porsi
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Section: Order List */}
        <div className="space-y-3">
            {displayedOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    <p>Tidak ada data untuk tanggal ini</p>
                </div>
            ) : (
                displayedOrders.map((order) => {
                    // Tentukan warna status
                    let statusColor = "bg-gray-100 text-gray-500";
                    let statusLabel = "Pending";
                    if (order.status === "cooking") {
                        statusColor = "bg-orange-100 text-orange-600";
                        statusLabel = "Dimasak";
                    } else if (order.status === "sent") {
                        statusColor = "bg-green-100 text-green-600";
                        statusLabel = "Dikirim";
                    }

                    return (
                        <div 
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className={`relative bg-white p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${
                                order.type === 'missing' ? 'border-red-200 bg-red-50/30' : 'border-gray-100 hover:border-pink-300 shadow-sm'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-800">{order.customerName}</h3>
                                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                        <MapPin className="w-3 h-3 shrink-0" />
                                        <span className="truncate max-w-[180px]">{order.address}</span>
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${statusColor}`}>
                                    {statusLabel}
                                </span>
                            </div>

                            {/* Bagian Menu */}
                            <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                                {order.menu ? (
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-gray-700">{order.menu}</p>
                                            {order.note && (
                                                <p className="text-[11px] text-orange-500 font-medium flex items-center gap-1 mt-1 bg-orange-50 px-2 py-0.5 rounded-md w-fit">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {order.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">
                                        <span className="text-xs font-bold flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            Belum Pilih Menu
                                        </span>
                                        <span className="text-[10px] underline">Pilih Sekarang</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {/* 3. Order Sheet (Popup Edit) */}
      <OrderSheet 
        open={!!selectedOrder} 
        onOpenChange={() => setSelectedOrder(null)} 
        order={selectedOrder} 
      />

    </div>
  );
}