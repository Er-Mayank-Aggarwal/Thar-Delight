import { Suspense } from "react";
import { getAllProducts, getAllCategories } from "@/app/actions/product-actions";
import ShopClient from "./ShopClient";

export const revalidate = 60;

export const metadata = {
  title: "Shop — Thar Delight",
  description: "Browse our collection of authentic millet cookies, farali treats, healthy snacks, and handcrafted wooden serveware from Rajasthan.",
};

export default async function Shop() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-warm-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold" />
      </div>
    }>
      <ShopClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
