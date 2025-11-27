"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- CREATE CUSTOMER ---
export async function createCustomer(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  
  // Ambil ID Paket dari form (Select Option value-nya harus ID)
  const packageId = formData.get("packageId") as string; 
  
  const preferences = formData.get("preferences") as string;
  const allergies = formData.get("allergies") as string;

  // 1. Cari Paket di Database untuk tahu durasinya
  const selectedPackage = await prisma.package.findUnique({
    where: { id: packageId }
  });

  if (!selectedPackage) {
    throw new Error("Paket tidak valid / tidak ditemukan");
  }

  // 2. Hitung Tanggal Berakhir Otomatis
  const startDate = new Date();
  const endDate = new Date(startDate);
  // Tambah durasi hari ke tanggal sekarang
  endDate.setDate(startDate.getDate() + selectedPackage.duration);

  // 3. Simpan ke Database
  await prisma.customer.create({
    data: {
      name,
      phone,
      address,
      preferences,
      allergies,
      packageId, // Simpan relasi ID
      startDate,
      endDate,
      usedDays: 0,
      status: "active",
    },
  });

  revalidatePath("/customer");
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({ where: { id } });
  revalidatePath("/customer");
}