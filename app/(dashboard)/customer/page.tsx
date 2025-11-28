// app/customers/page.tsx (atau lokasi file page server component kamu)

import { prisma } from "@/lib/prisma";
import CustomerClient from "./customer-client";

export const dynamic = "force-dynamic";

export default async function CustomerPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      // 1. Data Paket (Untuk status & progress)
      package: true, 

      // 2. Data Order/Riwayat (INI YANG DITAMBAHKAN)
      orders: {
        orderBy: { date: 'desc' }, // Urutkan dari yang paling baru
        take: 10, // Ambil 10 transaksi terakhir saja biar loading tidak berat
        include: {
          menu: true // Kita butuh nama menu untuk ditampilkan di history
        }
      }
    } 
  });

  // Ambil data packages untuk dropdown di form tambah customer
  const packages = await prisma.package.findMany({
    orderBy: { duration: 'asc' }
  });

  return <CustomerClient initialCustomers={customers} packages={packages} />;
}