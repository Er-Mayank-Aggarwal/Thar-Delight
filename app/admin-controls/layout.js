"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Users,
  Tag,
  Star,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin-controls",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin-controls/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/admin-controls/orders",
    icon: ShoppingCart,
  },
  {
    label: "Inventory",
    href: "/admin-controls/inventory",
    icon: Warehouse,
  },
  {
    label: "Customers",
    href: "/admin-controls/customers",
    icon: Users,
  },
  {
    label: "Coupons",
    href: "/admin-controls/coupons",
    icon: Tag,
  },
  {
    label: "Reviews",
    href: "/admin-controls/reviews",
    icon: Star,
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f1ec] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-brown transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="px-6 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-cursive text-2xl !text-brand-gold tracking-wide">
                  Thar Delight
                </h1>
                <p className="text-xs text-white/50 mt-1 font-sans tracking-widest uppercase">
                  Admin Panel
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin-controls" &&
                  pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-brand-gold/20 text-brand-gold shadow-sm"
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Back to site */}
          <div className="px-4 py-5 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-white/40 hover:text-brand-gold text-sm transition-colors duration-200"
            >
              <ArrowLeft size={16} />
              Back to Website
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-brand-sand/50">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-brand-brown hover:bg-brand-sand/50 transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Thar Delight"
                className="w-9 h-9 rounded-full object-cover border-2 border-brand-gold/30"
              />
              <span className="text-sm font-medium text-brand-brown hidden sm:block">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
