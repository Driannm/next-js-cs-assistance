import type { Metadata, Viewport } from "next"; // 1. Tambah import Viewport
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--inter-font", // Pastikan variable ini sesuai dengan CSS kamu
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CS Assistance",
  description: "Customer Service Assistance Platform",
};

// 2. Tambahkan konfigurasi Viewport ini
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Ini kuncinya agar tidak bisa di-zoom manual
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Pastikan class variable font terpasang */}
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}