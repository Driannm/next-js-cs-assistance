// app/(dashboard)/menu/page.tsx (Tanpa 'use client')
import { prisma } from "@/lib/prisma";
import MenuClient from "./menu-client";

// Supaya data selalu fresh (tidak dicache statis)
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  // 1. Fetch data langsung dari Database
  const menus = await prisma.menu.findMany({
    orderBy: {
      createdAt: 'desc' // Menu terbaru di paling atas
    }
  });

  // 2. Render Client Component dan kirim data
  return <MenuClient initialMenus={menus} />;
}