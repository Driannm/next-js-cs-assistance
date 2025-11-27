/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { CircleUser } from "lucide-react";

// Components
import CustomerHeader from "@/app/components/CustomerHeader";
import CustomerCardView from "@/app/components/CustomerCardView";
import CustomerTableView from "@/app/components/CustomerTableView";
import CustomerDetail from "@/app/components/CustomerDetail";

// Actions & Utils
import { createCustomer, deleteCustomer } from "@/app/actions/customer";
import { exportToExcel, exportToPDF } from "@/lib/export-helpers";

export default function CustomerClient({
  initialCustomers,
  packages,
}: {
  initialCustomers: unknown[];
  packages: any[];
}) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expired">("all");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Filter Logic
  const filteredCustomers = initialCustomers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === "all" ? true : c.status === filterStatus;
    return matchSearch && matchFilter;
  });

  // Action Handlers
  async function handleCreate(formData: FormData) {
    await createCustomer(formData);
    setIsSheetOpen(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Yakin ingin menghapus pelanggan ini?")) {
      await deleteCustomer(id);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <CustomerHeader
        search={search}
        setSearch={setSearch}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onExportExcel={() => exportToExcel(filteredCustomers)}
        onExportPDF={() => exportToPDF(filteredCustomers)}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        onCreateCustomer={handleCreate}
        packages={packages}
      />

      <div className="px-5 py-4">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CircleUser className="w-8 h-8 opacity-30 text-pink-400" />
            </div>
            <p className="text-sm">Belum ada data pelanggan</p>
          </div>
        ) : viewMode === "card" ? (
          <CustomerCardView
            customers={filteredCustomers}
            onSelect={setSelectedCustomer}
          />
        ) : (
          <CustomerTableView
            customers={filteredCustomers}
            onSelect={setSelectedCustomer}
            onDelete={handleDelete}
          />
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