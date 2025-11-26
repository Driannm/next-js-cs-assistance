"use client";

import { useState } from "react";
import {
  Home,
  CircleUser,
  ReceiptText,
  Soup,
  MoreHorizontal,
  Settings,
  Bell,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export default function BottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Pelanggan", href: "/pelanggan", icon: CircleUser },
    { name: "Order", href: "/order", icon: ReceiptText },
    { name: "Menu", href: "/menu", icon: Soup },
  ];

  const moreMenu = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Account", href: "/account", icon: UserCog },
  ];

  return (
    <>
      {/* Bottom Nav */}
      <nav className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto w-[94%] max-w-md bg-white/95 backdrop-blur-md rounded-2xl px-2 py-3 shadow-xl border border-gray-100">
          
          {/* Menggunakan Grid agar pembagian ruang presisi 5 kolom (4 menu + 1 more) */}
          <div className="grid grid-cols-5 items-end">
            
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                    active ? "text-pink-400" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {/* Icon size sedikit disesuaikan, stroke width diatur agar tidak terlalu tebal */}
                  <Icon className={`h-6 w-6 transition-transform duration-200 ${active ? "stroke-[2.5px]" : "stroke-2 group-hover:-translate-y-0.5"}`} />
                  <span className="text-[10px] font-medium leading-none">{item.name}</span>
                </Link>
              );
            })}

            {/* More button sebagai item ke-5 */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="group flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <MoreHorizontal className="h-6 w-6 stroke-2 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  <span className="text-[10px] font-medium leading-none">More</span>
                </button>
              </SheetTrigger>

              {/* More Menu Content */}
              <SheetContent side="bottom" className="pb-10 rounded-t-3xl">
                <SheetHeader>
                  <SheetTitle className="text-center">More Menu</SheetTitle>
                </SheetHeader>

                <div className="grid grid-cols-3 gap-6 mt-8">
                  {moreMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex flex-col items-center group"
                      >
                        <div className="bg-gray-50 text-gray-600 group-hover:bg-pink-50 group-hover:text-pink-400 transition-colors w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
                          <Icon className="h-7 w-7" />
                        </div>
                        <span className="text-xs font-medium text-gray-600 group-hover:text-pink-400 transition-colors">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
}