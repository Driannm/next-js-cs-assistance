"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- CREATE CUSTOMER ---
export async function createCustomer(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const packageType = formData.get("packageType") as string;
  // Konversi string ke number, default 10 hari jika kosong
  const totalDays = parseInt(formData.get("totalDays") as string) || 10; 

  await prisma.customer.create({
    data: {
      name,
      phone,
      address,
      packageType,
      totalDays,
      usedDays: 0, // Default mulai dari 0
      status: "active",
    },
  });

  revalidatePath("/customer"); // Refresh halaman
}

// --- DELETE CUSTOMER ---
export async function deleteCustomer(id: string) {
  await prisma.customer.delete({
    where: { id },
  });
  revalidatePath("/customer");
}