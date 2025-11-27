"use client";

import { MapPin } from "lucide-react";

interface CustomerCardViewProps {
  customers: any[];
  onSelect: (customer: any) => void;
}

export default function CustomerCardView({
  customers,
  onSelect,
}: CustomerCardViewProps) {
  return (
    <div className="space-y-4">
      {customers.map((customer) => {
        const isActive = customer.status === "active";
        const progressPercent = (customer.usedDays / customer.totalDays) * 100;

        return (
          <div
            key={customer.id}
            onClick={() => onSelect(customer)}
            className={`relative p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${
              isActive
                ? "bg-white border-gray-100 shadow-sm hover:border-pink-300"
                : "bg-gray-50 border-gray-100 opacity-70"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    isActive
                      ? "bg-pink-100 text-pink-500"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 leading-tight">
                    {customer.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">
                      {customer.address}
                    </span>
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                  isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isActive ? "Aktif" : "Selesai"}
              </span>
            </div>

            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-400 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-gray-500">
                {customer.usedDays}/{customer.totalDays} Hari
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}