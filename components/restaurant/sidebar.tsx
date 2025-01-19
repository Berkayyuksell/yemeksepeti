"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Store,
  ClipboardList,
  Settings,
  Menu as MenuIcon,
} from "lucide-react";

const menuItems = [
  {
    title: "Restaurant",
    href: "/restaurant-panel",
    icon: Store,
  },
  {
    title: "Menü",
    href: "/restaurant-panel/menu",
    icon: MenuIcon,
  },
  {
    title: "Siparişler",
    href: "/restaurant-panel/orders",
    icon: ClipboardList,
  },
  {
    title: "Ayarlar",
    href: "/restaurant-panel/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Restaurant Panel</h1>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              pathname === item.href
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-800"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
} 