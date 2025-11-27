import { prisma } from "@/lib/prisma";
import CustomerClient from "./customer-client";

export const dynamic = "force-dynamic";

export default async function CustomerPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      package: true // <--- WAJIB ADA: Agar kita bisa akses customer.package.name
    } 
  });

  // Ambil data packages untuk dropdown di form tambah
  const packages = await prisma.package.findMany({
    orderBy: { duration: 'asc' }
  });

  return <CustomerClient initialCustomers={customers} packages={packages} />;
}