"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import RecentSalesNotification from "./RecentSalesNotification";
import { CartProvider } from "../context/CartContext";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin-controls");

  if (isAdmin) {
    return <CartProvider>{children}</CartProvider>;
  }

  return (
    <CartProvider>
      <div id="site-header"><Header /></div>
      <main className="flex-1">{children}</main>
      <div id="site-footer"><Footer /></div>
      <div id="site-notifications"><RecentSalesNotification /></div>
    </CartProvider>
  );
}
