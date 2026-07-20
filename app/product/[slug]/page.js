import Link from "next/link";
import { getProductBySlug, getRelatedProducts, getFeaturedProducts } from "@/app/actions/product-actions";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product Not Found — Thar Delight" };
  }
  return {
    title: `${product.name} — Thar Delight`,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductDetail({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-brand-warm-white flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">🍪</span>
        <h2 className="font-serif text-3xl text-brand-brown mb-2 font-bold">Product Not Found</h2>
        <p className="text-gray-400 text-sm max-w-xs mb-8">
          The product you are looking for might have been moved or renamed.
        </p>
        <Link
          href="/shop"
          className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-white text-sm font-semibold rounded-full transition-all"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  // Fetch related and recommended products in parallel
  const [relatedProducts, featuredProducts] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 3),
    getFeaturedProducts(),
  ]);

  const recommendedProducts = featuredProducts
    .filter(feat => feat.id !== product.id)
    .slice(0, 3);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      recommendedProducts={recommendedProducts}
    />
  );
}
