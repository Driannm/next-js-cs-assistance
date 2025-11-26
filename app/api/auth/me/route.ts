import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.split("token=")[1];

  if (!token) return NextResponse.json({ user: null });

  const decoded = verifyToken(token);
  return NextResponse.json({ user: decoded || null });
}