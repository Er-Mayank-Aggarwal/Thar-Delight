import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { getFeaturedProducts } from "@/app/actions/product-actions";

export default async function FeaturedProducts() {
  const featured = await getFeaturedProducts();

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center justify-center mb-20 gap-4">
          <div>
            <span className="text-brand-gold text-sm font-semibold uppercase tracking-[0.2em]">
              Handpicked for You
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-brown mt-3">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-2 text-brand-gold hover:text-brand-gold-dark font-semibold transition-colors mt-6"
          >
            View All Products
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="flex flex-wrap justify-center gap-8 stagger-children">
          {featured.map((product) => (
            <div key={product.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
