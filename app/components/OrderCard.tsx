"use client";

import { MapPin, AlertCircle, CheckSquare, Square } from "lucide-react";
import { Order } from "@/lib/order-types";

interface OrderCardProps {
  order: Order;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (order: Order) => void;
  statusColor: string;
}

export default function OrderCard({
  order,
  isSelectionMode,
  isSelected,
  onToggleSelect,
  onEdit,
  statusColor,
}: OrderCardProps) {
  // Handler klik kartu
  const handleClick = () => {
    if (isSelectionMode) {
      onToggleSelect(order.customerId);
    } else {
      onEdit(order);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative bg-white p-4 rounded-xl border transition-all cursor-pointer group ${statusColor} ${
        isSelected
          ? "border-pink-500 bg-pink-50 ring-1 ring-pink-500"
          : "border-gray-100 hover:border-pink-300"
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

        {/* CHECKBOX UI - Visual Only (Logic di handleClick) */}
        {isSelectionMode && (
          <div className="ml-3 shrink-0 text-pink-500 transition-transform active:scale-90">
            {isSelected ? (
              <CheckSquare className="w-6 h-6 fill-pink-500 text-white" />
            ) : (
              <Square className="w-6 h-6 text-gray-300" />
            )}
          </div>
        )}
      </div>

      {/* Menu Info */}
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