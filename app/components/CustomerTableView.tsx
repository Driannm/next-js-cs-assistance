"use client";

import { Eye, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomerTableViewProps {
  customers: any[];
  onSelect: (customer: any) => void;
  onDelete: (id: string) => void;
}

export default function CustomerTableView({
  customers,
  onSelect,
  onDelete,
}: CustomerTableViewProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Paket</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-pink-50 transition-colors"
              >
                <td
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => onSelect(customer)}
                >
                  <div className="font-bold text-sm text-gray-800">
                    {customer.name}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {customer.phone}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {customer.package.name}
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    Sisa {customer.package.duration - customer.usedDays} Hari
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      customer.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {customer.status === "active" ? "Aktif" : "Selesai"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSelect(customer)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(customer.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus Data
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}