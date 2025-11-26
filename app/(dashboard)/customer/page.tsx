"use client";

import { useState } from "react";
import {
  Search, Plus, Phone, MapPin, MoreVertical,
  LayoutGrid, List, FileSpreadsheet, FileText, CheckCircle2, XCircle, LayoutList
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import CustomerDetail from "@/app/components/CustomerDetail";

// Import Library Export
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PelangganPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expired">("all");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Dummy Data
  const customers = [
    {
      id: 1,
      name: "Siska Kohl",
      phone: "628123456789",
      address: "Jl. Sultan Agung No. 10",
      status: "active",
      package: "Healthy Slimming (1 Bulan)",
      progress: { current: 12, total: 20 },
      lastMenu: "Ayam Bakar Madu",
    },
    {
      id: 2,
      name: "Budi Santoso",
      phone: "628111222333",
      address: "Komplek Green Garden Blok A",
      status: "active",
      package: "Muscle Gain (2 Minggu)",
      progress: { current: 9, total: 10 },
      lastMenu: "Beef Teriyaki",
    },
    {
      id: 3,
      name: "Ani Wijaya",
      phone: "628555666777",
      address: "Apartemen Mediterania Lt. 15",
      status: "expired",
      package: "Trial 5 Days",
      progress: { current: 5, total: 5 },
      lastMenu: "-",
    },
  ];

  // Logic Filter
  const filteredCustomers = customers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === "all" ? true : c.status === filterStatus;
    return matchSearch && matchFilter;
  });

  // --- FUNCTION EXPORT EXCEL ---
  const handleExportExcel = () => {
    const dataToExport = filteredCustomers.map(c => ({
        Nama: c.name,
        Paket: c.package,
        Status: c.status === 'active' ? 'Aktif' : 'Selesai',
        Progress: `${c.progress.current}/${c.progress.total} Hari`,
        NoHP: c.phone,
        Alamat: c.address
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pelanggan");
    XLSX.writeFile(workbook, "Data_Pelanggan_Catering.xlsx");
  };

  // --- FUNCTION EXPORT PDF ---
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Data Pelanggan Catering", 14, 15);
    
    const tableColumn = ["Nama", "Paket", "Status", "Progress", "No HP"];
    const tableRows = filteredCustomers.map(c => [
        c.name,
        c.package,
        c.status === 'active' ? 'Aktif' : 'Selesai',
        `${c.progress.current}/${c.progress.total}`,
        c.phone
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.save("Data_Pelanggan_Catering.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 1. Header Sticky */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-5 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Pelanggan</h1>
          
          <div className="flex gap-2">
             {/* Tombol Add */}
             <Sheet>
                <SheetTrigger asChild>
                <button className="bg-pink-400 hover:bg-pink-500 text-white p-2 rounded-xl shadow-lg shadow-pink-200 transition-colors">
                    <Plus className="w-5 h-5" />
                </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl pb-10">
                <SheetHeader className="mb-5">
                    <SheetTitle>Tambah Pelanggan Baru</SheetTitle>
                </SheetHeader>
                <div className="space-y-4">
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" placeholder="Nama Lengkap" />
                    <input type="tel" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" placeholder="Nomor WhatsApp" />
                    <button className="w-full bg-pink-400 text-white font-bold py-3 rounded-xl mt-4">Simpan</button>
                </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Controls Row: Search + View Toggle */}
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
            
            {/* View Toggle Buttons */}
            <div className="flex bg-gray-100 rounded-xl p-1 shrink-0">
                <button 
                    onClick={() => setViewMode("card")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "card" ? "bg-white shadow text-pink-500" : "text-gray-400 hover:text-gray-600"}`}
                >
                    <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-white shadow text-pink-500" : "text-gray-400 hover:text-gray-600"}`}
                >
                    <List className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Filter Pills & Export (Scrollable) */}
        <div className="flex justify-between items-center">
            {/* Filters */}
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
                                ? "bg-pink-400 text-white border-pink-400 shadow-md shadow-pink-200" 
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {f.label}
                        </button>
                    )
                })}
            </div>

            {/* Export Buttons (Only visible in Table Mode) */}
            {viewMode === "table" && (
                <div className="flex gap-2 pl-2 border-l border-gray-200 ml-2">
                    <button onClick={handleExportExcel} className="p-1.5 bg-green-50 text-green-600 rounded-lg border border-green-200 hover:bg-green-100" title="Export Excel">
                        <FileSpreadsheet className="w-4 h-4" />
                    </button>
                    <button onClick={handleExportPDF} className="p-1.5 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100" title="Export PDF">
                        <FileText className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
      </header>

      {/* 2. Content Area */}
      <div className="px-5 py-4">
        {filteredCustomers.length === 0 ? (
           <div className="text-center py-20 text-gray-400">
             <p className="text-sm">Tidak ada data ditemukan</p>
           </div>
        ) : viewMode === "card" ? (
          // --- CARD VIEW ---
          <div className="space-y-4">
            {filteredCustomers.map((customer) => {
               const isActive = customer.status === "active";
               const progressPercent = (customer.progress.current / customer.progress.total) * 100;

               return (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`group relative p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${
                    isActive ? "bg-white border-gray-100 shadow-sm hover:border-pink-300" : "bg-gray-50 border-gray-100 opacity-70"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isActive ? 'bg-pink-100 text-pink-500' : 'bg-gray-200 text-gray-500'}`}>
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 leading-tight">{customer.name}</h3>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{customer.address}</span>
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${isActive ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"}`}>
                        {isActive ? "Aktif" : "Selesai"}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center gap-3">
                     <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-400 rounded-full" style={{ width: `${progressPercent}%` }} />
                     </div>
                     <span className="text-[10px] font-medium text-gray-500">{customer.progress.current}/{customer.progress.total} Hari</span>
                  </div>
                </div>
               )
            })}
          </div>
        ) : (
          // --- TABLE VIEW ---
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
                      {filteredCustomers.map((customer) => (
                         <tr 
                            key={customer.id} 
                            onClick={() => setSelectedCustomer(customer)}
                            className="hover:bg-pink-50 transition-colors cursor-pointer"
                         >
                            <td className="px-4 py-3">
                               <div className="font-bold text-sm text-gray-800">{customer.name}</div>
                               <div className="text-[10px] text-gray-500">{customer.phone}</div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">
                               {customer.package}
                               <div className="text-[10px] text-gray-400 mt-0.5">
                                 Sisa {customer.progress.total - customer.progress.current} Hari
                               </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                               <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  customer.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                               }`}>
                                  {customer.status === 'active' ? 'Aktif' : 'Selesai'}
                               </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                               <button className="text-gray-400 hover:text-pink-500">
                                  <MoreVertical className="w-4 h-4 ml-auto" />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>

      {/* 3. Detail Popup Component */}
      <CustomerDetail 
         open={!!selectedCustomer} 
         onOpenChange={() => setSelectedCustomer(null)}
         customer={selectedCustomer} 
      />
    </div>
  );
}