"use client";

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Sun,
  Moon,
  CheckSquare,
  X,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderHeaderProps {
  date: Date;
  onChangeDate: (days: number) => void;
  session: "LUNCH" | "DINNER";
  setSession: (s: "LUNCH" | "DINNER") => void;
  isSelectionMode: boolean;
  toggleSelectionMode: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export default function OrderHeader({
  date,
  onChangeDate,
  session,
  setSession,
  isSelectionMode,
  toggleSelectionMode,
  onExportExcel,
  onExportPDF,
}: OrderHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 pb-4">
      {/* 1. Navigasi Tanggal */}
      <div className="px-5 py-4 flex items-center justify-between">
        <button
          onClick={() => onChangeDate(-1)}
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
            {date.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </h2>
        </div>
        <button
          onClick={() => onChangeDate(1)}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* 2. Tools Bar */}
      <div className="px-5 flex gap-2">
        {/* Session Toggle */}
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

        {/* Selection Mode Toggle */}
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

        {/* Export Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="px-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 flex flex-col items-center justify-center">
              <Download className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-bold">Export</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={onExportExcel}
              className="cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
              <span>Download Excel</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPDF} className="cursor-pointer">
              <FileText className="w-4 h-4 mr-2 text-red-600" />
              <span>Download PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}