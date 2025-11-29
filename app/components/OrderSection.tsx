"use client";

import { LucideIcon } from "lucide-react";
import OrderCard from "./OrderCard";
import { Order } from "@/lib/order-types";

interface OrderSectionProps {
  title: string;
  orders: Order[];
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  statusBorderColor: string;
  isSelectionMode: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onEdit: (order: Order) => void;
  emptyLabel: string;
}

export default function OrderSection({
  title,
  orders,
  icon: Icon,
  iconColor,
  bgColor,
  statusBorderColor,
  isSelectionMode,
  selectedIds,
  onToggleSelect,
  onEdit,
  emptyLabel,
}: OrderSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${bgColor}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h3 className="font-bold text-gray-700">{title}</h3>
        <span
          className={`${bgColor} ${iconColor} text-[10px] font-bold px-2 py-0.5 rounded-full`}
        >
          {orders.length}
        </span>
      </div>

      <div className="space-y-3">
        {orders.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
            <p className="text-xs text-gray-400">{emptyLabel}</p>
          </div>
        )}
        {orders.map((order) => (
          <OrderCard
            key={order.customerId}
            order={order}
            isSelectionMode={isSelectionMode}
            isSelected={selectedIds.includes(order.customerId)}
            onToggleSelect={onToggleSelect}
            onEdit={onEdit}
            statusColor={`border-l-4 ${statusBorderColor}`}
          />
        ))}
      </div>
    </section>
  );
}