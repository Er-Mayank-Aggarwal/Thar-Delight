"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Eye, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { toggleWishlist } from "../actions/wishlist-actions";

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const cartItem = cart.find((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItem) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisting) return;
    
    setIsWishlisting(true);
    const res = await toggleWishlist(product.id);
    if (res.success) {
      setIsWishlisted(res.added);
    }
    setIsWishlisting(false);
  };

  const handleUpdateQuantity = (e, increment) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + increment);
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const imageUrl = product.image || product.images?.[0]?.url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  const reviewCount = product.reviews?.length || product.reviewCount || 0;
  const calculatedRating = product.reviews?.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : (product.rating || 5);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-brand-sand/60 hover:border-brand-gold/30 transition-all duration-500 hover:shadow-xl hover:shadow-brand-gold/10 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-brand-cream">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={isWishlisting}
          className="absolute top-3 right-3 sm:top-12 sm:right-3 p-2 bg-white/90 hover:bg-white text-brand-brown rounded-full z-10 shadow-sm transition-all hover:scale-110 disabled:opacity-50"
          aria-label="Toggle Wishlist"
        >
          <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
        </button>

        {/* Quick Actions */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 w-[90%] opacity-100 lg:opacity-0 translate-y-0 lg:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10">
          {cartItem ? (
            <div className="flex-1 flex items-center justify-between bg-white text-brand-brown font-semibold rounded-full shadow-md px-2 py-1.5 sm:py-2">
              <button
                onClick={(e) => handleUpdateQuantity(e, -1)}
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-brand-cream hover:bg-brand-sand/30 rounded-full transition-colors"
              >
                -
              </button>
              <span className="text-xs sm:text-sm w-4 text-center">{cartItem.quantity}</span>
              <button
                onClick={(e) => handleUpdateQuantity(e, 1)}
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-brand-cream hover:bg-brand-sand/30 rounded-full transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-xl ${added ? "bg-emerald-500 hover:bg-emerald-600" : "bg-brand-gold hover:bg-brand-gold-dark"}`}
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? (
                "Added!"
              ) : (
                <>
                  <ShoppingBag size={14} className="hidden sm:block" />
                  Add to Cart
                </>
              )}
            </button>
          )}
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
                  i < Math.floor(calculatedRating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-gray-400">
            ({reviewCount})
          </span>
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
