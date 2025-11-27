"use client";

import {
  Search,
  LayoutGrid,
  List,
  LayoutList,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  FileText,
  Plus,
} from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import CustomerForm from "./CustomerForm";

interface CustomerHeaderProps {
  search: string;
  setSearch: (val: string) => void;
  viewMode: "card" | "table";
  setViewMode: (val: "card" | "table") => void;
  filterStatus: "all" | "active" | "expired";
  setFilterStatus: (val: "all" | "active" | "expired") => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (val: boolean) => void;
  onCreateCustomer: (formData: FormData) => Promise<void>;
  packages: any[];
}

export default function CustomerHeader({
  search,
  setSearch,
  viewMode,
  setViewMode,
  filterStatus,
  setFilterStatus,
  onExportExcel,
  onExportPDF,
  isSheetOpen,
  setIsSheetOpen,
  onCreateCustomer,
  packages,
}: CustomerHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-5 py-4 border-b border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Pelanggan</h1>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="bg-pink-400 hover:bg-pink-500 text-white p-2 rounded-xl shadow-lg shadow-pink-200 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <CustomerForm packages={packages} onAction={onCreateCustomer} />
        </Sheet>
      </div>

      {/* SEARCH & VIEW TOGGLE */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-200 outline-none"
          />
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setViewMode("card")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "card"
                ? "bg-white shadow text-pink-500"
                : "text-gray-400"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "table"
                ? "bg-white shadow text-pink-500"
                : "text-gray-400"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FILTER & EXPORT */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "all", label: "Semua", icon: LayoutList },
            { id: "active", label: "Aktif", icon: CheckCircle2 },
            { id: "expired", label: "Selesai", icon: XCircle },
          ].map((f) => {
            const Icon = f.icon;
            const isActive = filterStatus === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                  isActive
                    ? "bg-pink-400 text-white border-pink-400 shadow-md"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {f.label}
              </button>
            );
          })}
        </div>

        {viewMode === "table" && (
          <div className="flex gap-2 pl-2 border-l border-gray-200 ml-2">
            <button
              onClick={onExportExcel}
              className="p-1.5 bg-green-50 text-green-600 rounded-lg border border-green-200 hover:bg-green-100"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
            <button
              onClick={onExportPDF}
              className="p-1.5 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}