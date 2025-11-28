"use client";

import { useState } from "react";
import { Utensils } from "lucide-react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MenuFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function MenuForm({ onSubmit }: MenuFormProps) {
  const [file, setFile] = useState<File | null>(null);

  // Upload ke /api/upload
  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    const json = await res.json();
    return json.url; // URL file setelah upload
  }

  // Wrapper untuk form
  async function handleForm(formData: FormData) {
    let imageUrl = "/uploads/default.jpg";

    if (file) {
      imageUrl = await uploadImage(file);
    }

    formData.append("image", imageUrl);

    await onSubmit(formData); // eksekusi server action
  }

  return (
    <SheetContent side="bottom" className="rounded-t-3xl pb-10 h-[85vh] px-5">
      <SheetHeader className="mb-5">
        <SheetTitle>Tambah Menu Baru</SheetTitle>
      </SheetHeader>

      <form
        action={handleForm}
        className="space-y-4 overflow-y-auto max-h-[70vh] px-1"
      >
        {/* Image Upload */}
        <label className="h-40 w-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer">
          <Utensils className="w-8 h-8 mb-2" />
          <span className="text-xs">Upload Foto</span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        {/* Nama Menu */}
        <div>
          <label className="text-xs font-medium text-gray-500">Nama Menu</label>
          <input
            name="name"
            type="text"
            required
            className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
            placeholder="Contoh: Ayam Bakar Madu"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-medium text-gray-500">Kategori</label>
          <select
            name="category"
            className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
          >
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Juice">Juice</option>
          </select>
        </div>

        {/* Nutrition */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-500">
              Kalori (Kcal)
            </label>
            <input
              name="calories"
              type="number"
              className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
              placeholder="400"
            />
          </div>

          <div className="flex-1">
            <label className="text-xs font-medium text-gray-500">
              Protein (gr)
            </label>
            <input
              name="protein"
              type="text"
              className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
              placeholder="30g"
            />
          </div>

          <div className="flex-1">
            <label className="text-xs font-medium text-gray-500">
              Lemak (fat)
            </label>
            <input
              name="fat"
              type="text"
              className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400"
              placeholder="10g"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-medium text-gray-500">Deskripsi</label>
          <textarea
            name="description"
            className="w-full mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-pink-400 h-24 resize-none"
            placeholder="Deskripsi bahan dan rasa..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-400 text-white font-bold py-3 rounded-xl hover:bg-pink-500 transition-colors"
        >
          Simpan Menu
        </button>
      </form>
    </SheetContent>
  );
}