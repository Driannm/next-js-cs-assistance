"use client";

import { useState } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomerFormProps {
  packages: any[];
  onAction: (formData: FormData) => Promise<void>;
}

export default function CustomerForm({
  packages,
  onAction,
}: CustomerFormProps) {
  const [selectedPackage, setSelectedPackage] = useState<{
    id: string;
    name: string;
    duration: number;
  } | null>(null);

  return (
    <SheetContent side="bottom" className="rounded-t-3xl pb-10 px-5">
      <SheetHeader className="mb-2">
        <SheetTitle>Tambah Pelanggan Baru</SheetTitle>
      </SheetHeader>
      <form action={onAction} className="space-y-4">
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
        <div className="flex gap-3">
          <input
            name="preferences"
            type="text"
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm"
            placeholder="Preferensi (Cth: Nasi Merah)"
          />
          <input
            name="allergies"
            type="text"
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm"
            placeholder="Alergi (Cth: Udang)"
          />
        </div>

        {/* DROPDOWN PAKET */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 ml-1">
            Pilih Paket Langganan
          </label>
          <input
            type="hidden"
            name="packageId"
            value={selectedPackage?.id || ""}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-left text-sm flex justify-between items-center"
              >
                {selectedPackage
                  ? `${selectedPackage.name} (${selectedPackage.duration} Hari)`
                  : "Pilih Paket"}
                <span className="opacity-50 text-xs">▼</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[240px]">
              {packages.map((pkg) => (
                <DropdownMenuItem
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {pkg.name} — {pkg.duration} Hari
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-400 text-white font-bold py-3 rounded-xl mt-4"
        >
          Simpan Pelanggan
        </button>
      </form>
    </SheetContent>
  );
}