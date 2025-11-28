"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  AlertCircle,
  Loader2,
  Sun,
  Moon,
  ChefHat,
  Truck,
  ClipboardList,
  CheckSquare,
  Square,
  X,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  MoreVertical,
} from "lucide-react";
import OrderSheet from "@/app/components/OrderSheet";
import { getDailyData, bulkUpsertOrders } from "@/app/actions/order"; // Import bulk action
import { exportOrdersToExcel, exportOrdersToPDF } from "@/lib/export-orders";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"; // Import Sheet UI komponen
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrderPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [session, setSession] = useState<"LUNCH" | "DINNER">("LUNCH");

  const [orders, setOrders] = useState<any[]>([]);
  const [menuList, setMenuList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Single Edit
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // --- STATE BARU UNTUK BULK ACTION ---
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkSheetOpen, setIsBulkSheetOpen] = useState(false);
  const [bulkMenuId, setBulkMenuId] = useState("");
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  // Fetch Data
  async function fetchData() {
    setLoading(true);
    try {
      const data = await getDailyData(selectedDate.toISOString(), session);
      setOrders(data.orders);
      setMenuList(data.menus);
      // Reset seleksi saat ganti hari/sesi
      setSelectedIds([]);
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Gagal ambil data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [selectedDate, session]);

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleExportExcel = () => {
    if (orders.length === 0) return alert("Tidak ada data order");
    exportOrdersToExcel(orders, selectedDate, session);
  };

  const handleExportPDF = () => {
    if (orders.length === 0) return alert("Tidak ada data order");
    exportOrdersToPDF(orders, selectedDate, session);
  };

  // --- LOGIC BULK SELECTION ---
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]); // Reset saat toggle
  };

  const toggleSelectId = (customerId: string) => {
    if (selectedIds.includes(customerId)) {
      setSelectedIds(selectedIds.filter((id) => id !== customerId));
    } else {
      setSelectedIds([...selectedIds, customerId]);
    }
  };

  const selectAllPending = () => {
    const pendingIds = orders
      .filter((o) => !o.hasMenu || o.status === "pending")
      .map((o) => o.customerId);
    setSelectedIds(pendingIds);
  };

  // --- LOGIC BULK SUBMIT ---
  const handleBulkSubmit = async () => {
    if (!bulkMenuId) return alert("Pilih menu dulu!");
    setIsBulkSubmitting(true);
    try {
      await bulkUpsertOrders(
        selectedIds,
        bulkMenuId,
        selectedDate.toISOString(),
        session
      );
      setIsBulkSheetOpen(false);
      setIsSelectionMode(false);
      setSelectedIds([]);
      setBulkMenuId("");
      fetchData(); // Refresh data
    } catch (e) {
      alert("Gagal update massal");
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  // Grouping
  const pendingOrders = orders.filter(
    (o) => !o.hasMenu || o.status === "pending"
  );
  const cookingOrders = orders.filter(
    (o) => o.hasMenu && o.status === "cooking"
  );
  const sentOrders = orders.filter((o) => o.hasMenu && o.status === "sent");

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {" "}
      {/* pb ditambah biar ga ketutup floating bar */}
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 pb-4">
        {/* Navigasi Tanggal ... (kode lama) */}
        <div className="px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
              Jadwal Pengiriman
            </p>
            <h2 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
              <CalendarDays className="w-4 h-4 text-pink-500" />
              {selectedDate.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </h2>
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Toggle Session & Bulk Button */}
        <div className="px-5 flex gap-2">
          {/* Toggle Session */}
          <div className="bg-gray-100 p-1 rounded-xl flex relative flex-1">
            <button
              onClick={() => setSession("LUNCH")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all z-10 ${
                session === "LUNCH"
                  ? "bg-white text-orange-500 shadow-sm"
                  : "text-gray-400"
              }`}
            >
              <Sun className="w-4 h-4" /> Lunch
            </button>
            <button
              onClick={() => setSession("DINNER")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all z-10 ${
                session === "DINNER"
                  ? "bg-white text-indigo-500 shadow-sm"
                  : "text-gray-400"
              }`}
            >
              <Moon className="w-4 h-4" /> Dinner
            </button>
          </div>

          {/* Tombol Bulk Select */}
          <button
            onClick={toggleSelectionMode}
            className={`px-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-colors border ${
              isSelectionMode
                ? "bg-pink-50 border-pink-200 text-pink-600"
                : "bg-white border-gray-200 text-gray-600"
            }`}
          >
            {isSelectionMode ? (
              <X className="w-4 h-4 mb-0.5" />
            ) : (
              <CheckSquare className="w-4 h-4 mb-0.5" />
            )}
            {isSelectionMode ? "Batal" : "Pilih"}
          </button>

          {/* === TOMBOL EXPORT (BARU) === */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 flex flex-col items-center justify-center">
                <Download className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] font-bold">Export</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleExportExcel}
                className="cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                <span>Download Excel</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportPDF}
                className="cursor-pointer"
              >
                <FileText className="w-4 h-4 mr-2 text-red-600" />
                <span>Download PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {/* CONTENT */}
      <div className="px-5 py-6 space-y-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
          </div>
        ) : (
          <>
            {/* BUTTON SELECT ALL (Hanya muncul saat mode select) */}
            {isSelectionMode && (
              <div className="flex justify-between items-center bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
                <span className="text-xs font-bold text-blue-800">
                  {selectedIds.length} Pelanggan dipilih
                </span>
                <button
                  onClick={selectAllPending}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Pilih Semua (Pending)
                </button>
              </div>
            )}

            {/* 1. SECTION: PENDING / BELUM PILIH (Action Needed) */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-gray-200 p-1.5 rounded-lg">
                  <ClipboardList className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="font-bold text-gray-700">Perlu Disiapkan</h3>
                <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {pendingOrders.length === 0 && (
                  <EmptyState label="Semua aman!" />
                )}
                {pendingOrders.map((order) => (
                  <OrderCard
                    key={order.customerId}
                    order={order}
                    onClick={() => setSelectedOrder(order)}
                    statusColor="border-l-4 border-l-gray-300"
                  />
                ))}
              </div>
            </section>

            {/* 2. SECTION: MASAK (Cooking) */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-orange-100 p-1.5 rounded-lg">
                  <ChefHat className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-700">Sedang Dimasak</h3>
                <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {cookingOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {cookingOrders.length === 0 && (
                  <EmptyState label="Dapur kosong" />
                )}
                {cookingOrders.map((order) => (
                  <OrderCard
                    key={order.customerId}
                    order={order}
                    onClick={() => setSelectedOrder(order)}
                    statusColor="border-l-4 border-l-orange-400"
                  />
                ))}
              </div>
            </section>

            {/* 3. SECTION: TERKIRIM (Sent) */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-green-100 p-1.5 rounded-lg">
                  <Truck className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-700">Terkirim</h3>
                <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {sentOrders.length}
                </span>
              </div>

              <div className="space-y-3 opacity-80">
                {sentOrders.length === 0 && (
                  <EmptyState label="Belum ada pengiriman" />
                )}
                {sentOrders.map((order) => (
                  <OrderCard
                    key={order.customerId}
                    order={order}
                    onClick={() => setSelectedOrder(order)}
                    statusColor="border-l-4 border-l-green-500"
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      {/* FLOATING ACTION BAR (Muncul jika ada item terpilih) */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-25 left-5 right-5 z-30">
          <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-xl flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 font-medium">Terpilih</p>
              <p className="font-bold text-lg">{selectedIds.length} Orang</p>
            </div>
            <button
              onClick={() => setIsBulkSheetOpen(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-pink-500/30 transition-all"
            >
              Atur Menu
            </button>
          </div>
        </div>
      )}
      {/* SINGLE EDIT SHEET */}
      <OrderSheet
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
        order={selectedOrder}
        menuList={menuList}
        selectedDate={selectedDate}
        session={session}
        onSuccess={() => {
          setSelectedOrder(null);
          fetchData();
        }}
      />
      {/* BULK ACTION SHEET (Menu Selector) */}
      <Sheet open={isBulkSheetOpen} onOpenChange={setIsBulkSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl pb-8">
          <SheetHeader className="mb-5 text-left">
            <SheetTitle>Pilih Menu Massal</SheetTitle>
            <p className="text-sm text-gray-500">
              Akan diterapkan ke{" "}
              <span className="font-bold text-gray-800">
                {selectedIds.length} pelanggan
              </span>{" "}
              untuk sesi {session}.
            </p>
          </SheetHeader>

          <div className="space-y-4">
            <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 gap-2">
              {menuList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setBulkMenuId(m.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    bulkMenuId === m.id
                      ? "bg-pink-50 border-pink-400 text-pink-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium">{m.name}</span>
                  {bulkMenuId === m.id && (
                    <CheckCircle2 className="w-5 h-5 text-pink-500" />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleBulkSubmit}
              disabled={isBulkSubmitting || !bulkMenuId}
              className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isBulkSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Terapkan Menu"
              )}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// --- ORDER CARD MODIFIED ---
function OrderCard({
  order,
  onClick,
  statusColor,
  isSelectionMode,
  isSelected,
}: any) {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white p-4 rounded-xl border transition-all cursor-pointer ${statusColor} ${
        isSelected
          ? "border-pink-500 bg-pink-50 ring-1 ring-pink-500"
          : "border-gray-100"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-sm">
            {order.customerName}
          </h4>
          <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[200px]">{order.address}</span>
          </p>
        </div>

        {/* CHECKBOX UI */}
        {isSelectionMode && (
          <div className={`ml-3 shrink-0`}>
            {isSelected ? (
              <div className="bg-pink-500 text-white rounded-md p-0.5">
                <CheckSquare className="w-5 h-5" />
              </div>
            ) : (
              <div className="text-gray-300">
                <Square className="w-5 h-5" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Menu Info (Only show if not selecting to keep UI clean, or show always) */}
      <div className="mt-3 pt-3 border-t border-dashed border-gray-100/50">
        {order.hasMenu ? (
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {order.menuName}
            </p>
            {order.note && (
              <p className="text-[10px] text-orange-600 mt-1">
                Note: {order.note}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-500 text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5" /> Belum Pilih Menu
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
