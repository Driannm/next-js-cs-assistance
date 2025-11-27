// app/actions/menu.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMenu(formData: FormData) {
  const name = formData.get("name") as string;
  const calories = parseInt(formData.get("calories") as string) || 0;
  const protein = formData.get("protein") as string;
  const description = formData.get("description") as string;
  
  // Kategori: Di form belum ada dropdown, kita set default atau ambil jika ada
  // Untuk sementara kita hardcode logic sederhana atau ambil dari input
  // Disini saya anggap nanti ada input hidden atau select bernama 'category'
  // Jika tidak ada, default ke "Chicken" agar tidak error
  const category = (formData.get("category") as string) || "Chicken"; 

  // Image: Karena belum ada upload file, kita pakai placeholder atau URL input
  // Nanti bisa diganti dengan Uploadthing / AWS S3
  const image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"; 

  await prisma.menu.create({
    data: {
      name,
      calories,
      protein,
      description,
      category,
      image,
      ingredients: "Bawang, Garam, Cinta", // Dummy default
    },
  });

  // Refresh halaman agar data baru muncul
  revalidatePath("/menu");
}