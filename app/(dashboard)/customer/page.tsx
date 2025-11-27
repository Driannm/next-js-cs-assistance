import { prisma } from "@/lib/prisma";
import CustomerClient from "./customer-client";

// Agar data selalu update saat dibuka
export const dynamic = "force-dynamic";

export default async function CustomerPage() {
  // Ambil data pelanggan dari database
  const customers = await prisma.customer.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <CustomerClient initialCustomers={customers} />;
}