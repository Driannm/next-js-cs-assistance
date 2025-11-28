// app/actions/menu.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMenu(formData: FormData) {
  const name = formData.get("name") as string;
  const calories = Number(formData.get("calories") || 0);
  const protein = formData.get("protein") as string;
  const fat = formData.get("fat") as string;
  const description = formData.get("description") as string;

  const category = (formData.get("category") as string) || "Lunch";
  const image = (formData.get("image") as string) || "/uploads/default.jpg";

  await prisma.menu.create({
    data: {
      name,
      calories,
      protein,
      fat,
      description,
      category,
      image,
      ingredients: "Bawang, Garam, Cinta", // dummy
    },
  });

  revalidatePath("/menu");
}