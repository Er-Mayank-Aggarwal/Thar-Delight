"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { getFeaturedProducts } from "../data/products";

export default function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
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
            className="group flex items-center gap-2 text-brand-gold hover:text-brand-gold-dark font-semibold transition-colors"
          >
            View All Products
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
