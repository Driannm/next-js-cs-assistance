import { NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";

const users = [
  {
    id: 1,
    name: "Admin",
    email: "admin@mail.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "Editor",
    email: "editor@mail.com",
    password: "editor123",
    role: "editor",
  },
];

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json(
      { message: "Email atau password salah" },
      { status: 401 }
    );
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const res = NextResponse.json({ success: true });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    secure: true,
  });

  return res;
}
