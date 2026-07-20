import { getAllInventory } from "@/app/actions/inventory-actions";
import AdminInventoryClient from "./AdminInventoryClient";
import { Suspense } from "react";

export const revalidate = 30;

export const metadata = {
  title: "Inventory Admin — Thar Delight",
};

export default async function AdminInventory() {
  const data = await getAllInventory();
  
  // Map the data for the client component
  const mappedStock = data.map(item => ({
    ...item,
    productName: item.product.name,
    categoryName: item.product.category?.name || "Unknown",
    image: item.product.images?.[0]?.url || null,
  }));

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-gold mr-3"></div>
        <div className="text-gray-400 text-sm">Loading inventory...</div>
      </div>
    }>
      <AdminInventoryClient initialStock={mappedStock} />
    </Suspense>
  );
}
