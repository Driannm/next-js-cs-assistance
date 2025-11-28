// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${file.name}`;
  const uploadPath = path.join(process.cwd(), "public/uploads", filename);

  await writeFile(uploadPath, buffer);

  const url = `/uploads/${filename}`;

  return NextResponse.json({ url });
}