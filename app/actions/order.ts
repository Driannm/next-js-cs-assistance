"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Terima date sebagai string (ISO) biar aman
export async function getDailyData(dateString: string | Date, session: "LUNCH" | "DINNER") {
  console.log("📥 Fetching daily data:", { dateString, session }); // Debugging

  // Konversi string balik ke Date
  const dateObj = new Date(dateString);
  
  const startOfDay = new Date(dateObj);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(dateObj);
  endOfDay.setHours(23, 59, 59, 999);

  // 1. Ambil Customer (Perbaikan Logic Status)
  const customers = await prisma.customer.findMany({
    where: {
      // Cek variasi penulisan status, atau hapus where ini jika ingin semua data
      status: {
        in: ["active", "Active", "AKTIF", "Aktif"] 
      }
    },
    include: {
      orders: {
        where: {
          date: { gte: startOfDay, lte: endOfDay },
          session: session 
        },
        include: { menu: true },
      },
    },
    orderBy: { name: "asc" },
  });

  console.log(`✅ Found ${customers.length} active customers`); // Cek terminal VS Code

  const menus = await prisma.menu.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Mapping Data
  const formattedOrders = customers.map((c) => {
    const existingOrder = c.orders[0]; 

    return {
      customerId: c.id,
      customerName: c.name,
      address: c.address,
      preferences: c.preferences,
      allergies: c.allergies,
      
      orderId: existingOrder?.id || null,
      menuId: existingOrder?.menuId || null,
      menuName: existingOrder?.menu?.name || null,
      note: existingOrder?.note || "",
      
      status: existingOrder?.status || "pending", 
      
      // Helper: Apakah sudah pilih menu?
      hasMenu: !!existingOrder?.menuId
    };
  });

  return { orders: formattedOrders, menus };
}

// ... upsertOrder tetap sama (pastikan export upsertOrder ada di bawah)
export async function upsertOrder(formData: FormData) {
  // ... (kode upsertOrder yang lama)
  const customerId = formData.get("customerId") as string;
  const menuId = formData.get("menuId") as string;
  const note = formData.get("note") as string;
  const status = formData.get("status") as string;
  const dateString = formData.get("date") as string;
  const session = formData.get("session") as string;

  const date = new Date(dateString);
  date.setHours(10, 0, 0, 0); 

  await prisma.order.upsert({
    where: {
      customerId_date_session: {
        customerId,
        date,
        session
      }
    },
    update: {
      menuId: menuId || null,
      note,
      status,
    },
    create: {
      customerId,
      date,
      session,
      menuId: menuId || null,
      note,
      status,
    }
  });

  revalidatePath("/orders");
}

export async function bulkUpsertOrders(
  customerIds: string[],
  menuId: string,
  dateString: string,
  session: string
) {
  const date = new Date(dateString);
  date.setHours(10, 0, 0, 0); // Normalisasi jam

  // Gunakan Transaction agar semua sukses atau semua gagal (Atomic)
  await prisma.$transaction(
    customerIds.map((customerId) =>
      prisma.order.upsert({
        where: {
          customerId_date_session: {
            customerId,
            date,
            session,
          },
        },
        update: {
          menuId,
          status: "pending", // Reset ke pending atau biarkan status lama (tergantung kebutuhan, disini kita reset biar aman)
        },
        create: {
          customerId,
          date,
          session,
          menuId,
          status : "pending",
        },
      })
    )
  );

  revalidatePath("/orders");
}