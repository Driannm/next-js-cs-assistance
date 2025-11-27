"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Phone,
  Eye,
  MapPin,
  MoreVertical,
  LayoutGrid,
  List,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  XCircle,
  LayoutList,
  Trash2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CustomerDetail from "@/app/components/CustomerDetail";
import { createCustomer, deleteCustomer } from "@/app/actions/customer";

// Import Library Export
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CustomerClient({
  initialCustomers,
}: {
  initialCustomers: any[];
}) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "expired"
  >("all");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Filter Logic
  const filteredCustomers = initialCustomers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterStatus === "all" ? true : c.status === filterStatus;
    return matchSearch && matchFilter;
  });

  // Handle Create (Server Action Wrapper)
  async function handleCreate(formData: FormData) {
    await createCustomer(formData);
    setIsSheetOpen(false); // Tutup sheet setelah simpan
  }

  // Handle Delete
  async function handleDelete(id: string) {
    if (confirm("Yakin ingin menghapus pelanggan ini?")) {
      await deleteCustomer(id);
    }
  }

  // --- EXPORT FUNCTIONS ---
  const handleExportExcel = () => {
    const dataToExport = filteredCustomers.map((c) => ({
      Nama: c.name,
      Paket: c.packageType,
      Status: c.status,
      Progress: `${c.usedDays}/${c.totalDays} Hari`,
      NoHP: c.phone,
      Alamat: c.address,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pelanggan");
    XLSX.writeFile(workbook, "Data_Pelanggan.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Data Pelanggan", 14, 15);
    const tableColumn = ["Nama", "Paket", "Status", "Progress", "No HP"];
    const tableRows = filteredCustomers.map((c) => [
      c.name,
      c.packageType,
      c.status,
      `${c.usedDays}/${c.totalDays}`,
      c.phone,
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("Data_Pelanggan.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER STICKY */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-5 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Pelanggan</h1>

          {/* Form Tambah Pelanggan */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="bg-pink-400 hover:bg-pink-500 text-white p-2 rounded-xl shadow-lg shadow-pink-200 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl pb-10 px-5">
              <SheetHeader className="mb-2">
                <SheetTitle>Tambah Pelanggan Baru</SheetTitle>
              </SheetHeader>
              <form action={handleCreate} className="space-y-4">
                <div>
                  <input
                    name="name"
                    required
                    type="text"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
                    placeholder="Nama Lengkap"
                  />
                </div>
                <div>
                  <input
                    name="phone"
                    required
                    type="tel"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
                    placeholder="Nomor WhatsApp"
                  />
                </div>
                <div>
                  <input
                    name="address"
                    required
                    type="text"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
                    placeholder="Alamat Pengiriman"
                  />
                </div>
                <div>
                  <input
                    name="request"
                    required
                    type="text"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
                    placeholder="Catatan Khusus"
                  />
                </div>
                <div className="flex gap-3 items-center">
                  {/* Dropdown Paket */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-left text-sm flex justify-between items-center"
                      >
                        {selectedPackage || "Pilih Paket"}
                        <span className="opacity-50 text-xs">▼</span>
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-[200px]">
                      <DropdownMenuItem
                        onClick={() => setSelectedPackage("Healthy Slimming")}
                      >
                        Healthy Slimming
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setSelectedPackage("Muscle Gain")}
                      >
                        Muscle Gain
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => setSelectedPackage("Trial")}
                      >
                        Trial 3 Hari
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Input Total Hari */}
                  <input
                    name="totalDays"
                    type="number"
                    defaultValue={10}
                    className="w-20 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400 text-center"
                    placeholder="Hari"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-400 text-white font-bold py-3 rounded-xl mt-4"
                >
                  Simpan Pelanggan
                </button>
              </form>
            </SheetContent>
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
                onClick={handleExportExcel}
                className="p-1.5 bg-green-50 text-green-600 rounded-lg border border-green-200 hover:bg-green-100"
              >
                <FileSpreadsheet className="w-4 h-4" />
              </button>
              <button
                onClick={handleExportPDF}
                className="p-1.5 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CONTENT LIST */}
      <div className="px-5 py-4">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-sm">Belum ada data pelanggan.</p>
          </div>
        ) : viewMode === "card" ? (
          // CARD VIEW
          <div className="space-y-4">
            {filteredCustomers.map((customer) => {
              const isActive = customer.status === "active";
              const progressPercent =
                (customer.usedDays / customer.totalDays) * 100;

              return (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
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
        ) : (
          // TABLE VIEW
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
                      className="hover:bg-pink-50 transition-colors"
                    >
                      <td
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <div className="font-bold text-sm text-gray-800">
                          {customer.name}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {customer.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {customer.packageType}
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          Sisa {customer.totalDays - customer.usedDays} Hari
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
                            <DropdownMenuItem
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(customer.id)}
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
        )}
      </div>

      <CustomerDetail
        open={!!selectedCustomer}
        onOpenChange={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
      />
    </div>
  );
}
