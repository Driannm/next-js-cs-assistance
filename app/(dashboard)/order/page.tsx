"use client";

import { useState, useEffect } from "react";
import { Loader2, ClipboardList, ChefHat, Truck } from "lucide-react";

// Components
import OrderHeader from "@/app/components/OrderHeader";
import OrderSection from "@/app/components/OrderSection";
import BulkActions from "@/app/components/OrderBulkAction";
import OrderSheet from "@/app/components/OrderSheet"; // Sheet Edit Single (kode lama)

// Actions & Utils
import { getDailyData, bulkUpsertOrders } from "@/app/actions/order";
import { exportOrdersToExcel, exportOrdersToPDF } from "@/lib/export-orders";
import { Order } from "@/lib/order-types";

export default function OrderPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [session, setSession] = useState<"LUNCH" | "DINNER">("LUNCH");
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuList, setMenuList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch Data
  async function fetchData() {
    setLoading(true);
    try {
      const data = await getDailyData(selectedDate.toISOString(), session);
      setOrders(data.orders as Order[]);
      setMenuList(data.menus);
      // Reset seleksi saat refresh
      setSelectedIds([]);
    } catch (error) {
      console.error("Gagal ambil data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [selectedDate, session]);

  // Handlers
  const handleChangeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleToggleSelect = (customerId: string) => {
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

  const handleBulkSubmit = async (menuId: string) => {
    try {
      await bulkUpsertOrders(
        selectedIds,
        menuId,
        selectedDate.toISOString(),
        session
      );
      // Mode seleksi dimatikan setelah sukses
      setIsSelectionMode(false);
      setSelectedIds([]);
      fetchData();
    } catch (e) {
      alert("Gagal update massal");
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
      <OrderHeader
        date={selectedDate}
        onChangeDate={handleChangeDate}
        session={session}
        setSession={setSession}
        isSelectionMode={isSelectionMode}
        toggleSelectionMode={() => {
          setIsSelectionMode(!isSelectionMode);
          setSelectedIds([]);
        }}
        onExportExcel={() => exportOrdersToExcel(orders, selectedDate, session)}
        onExportPDF={() => exportOrdersToPDF(orders, selectedDate, session)}
      />

      <div className="px-5 py-6 space-y-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
          </div>
        ) : (
          <>
            {/* Select All Button */}
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

            <OrderSection
              title="Perlu Disiapkan"
              orders={pendingOrders}
              icon={ClipboardList}
              iconColor="text-gray-600"
              bgColor="bg-gray-200"
              statusBorderColor="border-l-gray-300"
              isSelectionMode={isSelectionMode}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onEdit={setSelectedOrder}
              emptyLabel="Semua aman!"
            />

            <OrderSection
              title="Sedang Dimasak"
              orders={cookingOrders}
              icon={ChefHat}
              iconColor="text-orange-600"
              bgColor="bg-orange-100"
              statusBorderColor="border-l-orange-400"
              isSelectionMode={isSelectionMode}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onEdit={setSelectedOrder}
              emptyLabel="Dapur kosong"
            />

            <OrderSection
              title="Terkirim"
              orders={sentOrders}
              icon={Truck}
              iconColor="text-green-600"
              bgColor="bg-green-100"
              statusBorderColor="border-l-green-500"
              isSelectionMode={isSelectionMode}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onEdit={setSelectedOrder}
              emptyLabel="Belum ada pengiriman"
            />
          </>
        )}
      </div>

      <BulkActions
        selectedCount={selectedIds.length}
        session={session}
        menuList={menuList}
        onSubmit={handleBulkSubmit}
      />

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
    </div>
  );
}