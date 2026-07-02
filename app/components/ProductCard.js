"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Eye } from "lucide-react";

export default function ProductCard({ product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-brand-sand/60 hover:border-brand-gold/30 transition-all duration-500 hover:shadow-xl hover:shadow-brand-gold/10 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-brand-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-brand-brown/0 group-hover:bg-brand-brown/20 transition-all duration-500" />

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full z-10 ${product.badge === "Sale"
              ? "bg-red-500 text-white"
              : product.badge === "New"
                ? "bg-emerald-500 text-white"
                : "bg-brand-gold text-white"
              }`}
          >
            {product.badge}
          </span>
        )}

        {/* Discount badge */}
        {discount && (
          <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full z-10">
            -{discount}%
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 w-[90%] opacity-100 lg:opacity-0 translate-y-0 lg:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-xl"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={14} className="hidden sm:block" />
            Add to Cart
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white/95 hover:bg-white text-brand-brown rounded-full transition-all duration-300 shadow-md hover:shadow-xl"
            aria-label={`View ${product.name}`}
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.floor(product.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg text-brand-brown group-hover:text-brand-gold transition-colors duration-300 mb-1 line-clamp-1">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-brand-brown">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
