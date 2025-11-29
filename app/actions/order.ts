"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- HELPER FUNCTION BARU: HITUNG ULANG HARI ---
async function recalculateCustomerProgress(customerId: string) {
  // 1. Hitung berapa hari UNIK customer ini punya order
  // (Lunch & Dinner di hari yang sama dihitung 1 hari)
  const uniqueDates = await prisma.order.findMany({
    where: {
      customerId: customerId,
      // Opsional: Hanya hitung jika status bukan cancelled?
      // status: { not: 'cancelled' }
    },
    select: {
      date: true,
    },
    distinct: ["date"], // <--- KUNCI: Hitung berdasarkan tanggal unik
  });

  const usedDays = uniqueDates.length;

  // 2. Ambil data customer untuk cek durasi paket
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: { package: true },
  });

  if (!customer) return;

  const totalDays = customer.package.duration;

  // 3. Tentukan Status Baru
  // Jika usedDays >= totalDays, otomatis set ke "expired" (Selesai)
  // Jika masih kurang, pastikan status "active"
  let newStatus = customer.status;
  if (usedDays >= totalDays) {
    newStatus = "expired";
  } else if (usedDays < totalDays && customer.status === "expired") {
    // Kalau admin hapus order, status bisa balik jadi active
    newStatus = "active";
  }

  // 4. Update Customer di Database
  await prisma.customer.update({
    where: { id: customerId },
    data: {
      usedDays: usedDays,
      status: newStatus,
    },
  });
}

// ... Fungsi getDailyData BIARKAN TETAP SAMA seperti sebelumnya ...
export async function getDailyData(
  dateString: string | Date,
  session: "LUNCH" | "DINNER"
) {
  // ... (KODE LAMA JANGAN DIUBAH) ...
  console.log("📥 Fetching daily data:", { dateString, session });
  const dateObj = new Date(dateString);
  const startOfDay = new Date(dateObj);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(dateObj);
  endOfDay.setHours(23, 59, 59, 999);

  const customers = await prisma.customer.findMany({
    where: { status: { in: ["active", "Active", "AKTIF", "Aktif"] } },
    include: {
      orders: {
        where: { date: { gte: startOfDay, lte: endOfDay }, session: session },
        include: { menu: true },
      },
    },
    orderBy: { name: "asc" },
  });
  const menus = await prisma.menu.findMany({
    select: { id: true, name: true, category: true },
    orderBy: { name: "asc" },
  });

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
      hasMenu: !!existingOrder?.menuId,
    };
  });
  return { orders: formattedOrders, menus };
}

// --- UPDATE FUNGSI UPSERT ---
export async function upsertOrder(formData: FormData) {
  const customerId = formData.get("customerId") as string;
  const menuId = formData.get("menuId") as string;
  const note = formData.get("note") as string;
  const status = formData.get("status") as string;
  const dateString = formData.get("date") as string;
  const session = formData.get("session") as string;

  const date = new Date(dateString);
  date.setHours(10, 0, 0, 0); // Jam harus konsisten

  // 1. Simpan Order
  await prisma.order.upsert({
    where: {
      customerId_date_session: { customerId, date, session },
    },
    update: { menuId: menuId || null, note, status },
    create: { customerId, date, session, menuId: menuId || null, note, status },
  });

  // 2. HITUNG ULANG PROGRESS (Panggil helper function tadi)
  await recalculateCustomerProgress(customerId);

  revalidatePath("/orders");
  revalidatePath("/customers"); // Refresh halaman customer juga
}

// --- UPDATE FUNGSI BULK UPSERT ---
export async function bulkUpsertOrders(
  customerIds: string[],
  menuId: string,
  dateString: string,
  session: string
) {
  const date = new Date(dateString);
  date.setHours(10, 0, 0, 0);

  // 1. Simpan Semua Order
  await prisma.$transaction(
    customerIds.map((customerId) =>
      prisma.order.upsert({
        where: { customerId_date_session: { customerId, date, session } },
        update: { menuId, status: "pending" },
        create: { customerId, date, session, menuId, status: "pending" },
      })
    )
  );

  // 2. HITUNG ULANG PROGRESS UNTUK SEMUA PELANGGAN TERKAIT
  // Kita pakai Promise.all biar cepat (parallel)
  await Promise.all(customerIds.map((id) => recalculateCustomerProgress(id)));

  revalidatePath("/orders");
  revalidatePath("/customers");
}
