import { getAllProducts, getAllCategories } from "@/app/actions/product-actions";
import AdminProductsClient from "./AdminProductsClient";
import { Suspense } from "react";

export const revalidate = 30;

export const metadata = {
  title: "Products Admin — Thar Delight",
};

export default async function AdminProducts() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-gold mr-3"></div>
        <div className="text-gray-400 text-sm">Loading products...</div>
      </div>
    }>
      <AdminProductsClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
