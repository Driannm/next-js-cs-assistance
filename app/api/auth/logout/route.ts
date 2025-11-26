// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Berhasil logout" });

  // Cara menghapus cookie adalah menimpanya dengan string kosong
  // dan mengatur waktu expired-nya ke masa lalu (0)
  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // Ini kuncinya: langsung kadaluarsa
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}