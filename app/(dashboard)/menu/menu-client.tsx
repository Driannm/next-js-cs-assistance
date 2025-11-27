"use client";

import { useState } from "react";
import { Utensils, Drumstick, Beef, Milk } from "lucide-react";
import MenuDetail from "@/app/components/MenuDetail"; 
import { createMenu } from "@/app/actions/menu";

// Import komponen modular
import { Menu, Category } from "@/lib/types";
import MenuHeader from "@/app/components/MenuHeader";
import MenuGrid from "@/app/components/MenuGrid";

export default function MenuClient({ initialMenus }: { initialMenus: Menu[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const categories: Category[] = [
    { name: "All", label: "Semua", icon: Utensils },
    { name: "Lunch", label: "Lunch", icon: Drumstick },
    { name: "Dinner", label: "Dinner", icon: Beef },
    { name: "Juice", label: "Juice", icon: Milk },
  ];

  // Logic Filter
  const filteredMenus = initialMenus.filter((menu) => {
    const matchSearch = menu.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || menu.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Handle Create
  async function handleSubmit(formData: FormData) {
    await createMenu(formData);
    setIsSheetOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <MenuHeader
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        onFormSubmit={handleSubmit}
      />

      <div className="px-5 py-4">
        <MenuGrid menus={filteredMenus} onSelect={setSelectedMenu} />
      </div>

      <MenuDetail
        open={!!selectedMenu}
        onOpenChange={() => setSelectedMenu(null)}
        menu={selectedMenu}
      />
    </div>
  );
}