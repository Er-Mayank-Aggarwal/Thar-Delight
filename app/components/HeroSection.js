"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Star, Leaf, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getHeroProducts } from "../actions/product-actions";

const bgGradients = [
  "#6e4b2d, #8a5e38, #6e4b2d", // Ajwain Cookies - Lighter rich brown
  "#5a4a3b, #735f4b, #5a4a3b", // Bajra Til Cookies
  "#4d3326, #664332, #4d3326", // Dark Chocolate Cookies
  "#7a5944, #946c53, #7a5944", // Farali Almond Cookies
  "#6b5c43, #857253, #6b5c43", // Farali Jeera Cookies
  "#8a6730, #a87d3a, #8a6730", // Millet Bhel
];

export default function HeroSection({ initialProducts = [] }) {
  const [rotationStep, setRotationStep] = useState(0);
  const [radius, setRadius] = useState(400);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const [realProducts, setRealProducts] = useState(initialProducts);

  const activeIndex = realProducts.length > 0 
    ? ((rotationStep % realProducts.length) + realProducts.length) % realProducts.length 
    : 0;

  const activeProduct = realProducts[activeIndex] || {};

  // Auto-rotate forward continuously every 5 seconds without rewinding
  useEffect(() => {
    if (realProducts.length <= 1) return;
    const timer = setInterval(() => {
      setRotationStep((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [realProducts.length]);

  // Sync if initialProducts changes
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setRealProducts(initialProducts);
    } else {
      const loadDbProducts = async () => {
        try {
          const prods = await getHeroProducts(6);
          setRealProducts(prods);
        } catch (e) {
          console.error("Failed to load hero products from DB:", e);
        }
      };
      loadDbProducts();
    }
  }, [initialProducts]);

  // Update circle radius based on screen size
  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 640) {
        setRadius(160); // Mobile (diameter 320px) to fit better
      } else if (window.innerWidth < 1024) {
        setRadius(260); // Tablet
      } else {
        setRadius(400); // Desktop
      }
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const handleAddToCart = () => {
    if (!activeProduct.id || (activeProduct.inventory && activeProduct.inventory.quantity <= 0)) return;
    setIsAdding(true);
    addToCart(activeProduct, 1);
    setIsAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!realProducts || realProducts.length === 0) {
    return null;
  }

  const baseAngle = radius < 400 ? 180 : 160;
  const thumbSize = radius < 400 ? 64 : radius < 1024 ? 56 : 96;

  const handleSelectProduct = (idx) => {
    const total = realProducts.length || 1;
    const currentMod = ((rotationStep % total) + total) % total;
    let diff = idx - currentMod;
    if (diff < 0) diff += total;
    setRotationStep((prev) => prev + diff);
  };

  return (
    <section 
      className="relative overflow-hidden min-h-[100vh] flex flex-col justify-center py-20 lg:py-0 transition-all duration-[1000ms] ease-in-out"
      style={{
        background: `linear-gradient(135deg, ${bgGradients[activeIndex % bgGradients.length]})`
      }}
    >
      {/* Decorative Floating Sparks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(195,154,95,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(195,154,95,0.1),transparent_50%)]" />

        <div className="absolute top-[20%] left-[10%] w-2 h-2 rounded-full bg-brand-gold/30 animate-float" style={{ animationDuration: "5s" }} />
        <div className="absolute top-[60%] left-[25%] w-3 h-3 rounded-full bg-brand-gold/20 animate-float" style={{ animationDuration: "7s", animationDelay: "1s" }} />
        <div className="absolute top-[80%] left-[45%] w-2 h-2 rounded-full bg-brand-gold/40 animate-float" style={{ animationDuration: "4s", animationDelay: "2s" }} />
        <div className="absolute top-[15%] left-[50%] w-1.5 h-1.5 rounded-full bg-brand-gold/25 animate-float" style={{ animationDuration: "6s", animationDelay: "1.5s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Product Details */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <div key={activeIndex} className="space-y-6">
              
              {/* Category/Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 animate-fade-in-up duration-500">
                <Leaf size={14} className="text-brand-gold animate-spin-slow" />
                <span className="text-brand-gold text-xs font-semibold uppercase tracking-wider">
                  {(activeProduct.category || "").toString().replace("-", " ")}
                </span>
              </div>

              {/* Title & Subtitle */}
              {(() => {
                const [heroMainTitle, heroSubTitle] = (activeProduct.name || "").split("|").map(s => s.trim());
                return (
                  <>
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight overflow-hidden">
                      <span className="block text-white font-serif font-bold animate-fade-in-up duration-500">
                        {heroMainTitle}
                      </span>
                    </h1>
                    {heroSubTitle && (
                      <p className="text-brand-gold text-sm sm:text-base font-semibold tracking-wide animate-fade-in-up duration-600">
                        {heroSubTitle}
                      </p>
                    )}
                  </>
                );
              })()}

              {/* Short description */}
              <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 min-h-[72px] animate-fade-in-up duration-700">
                {activeProduct.shortDescription}
              </p>


              {/* Price & Rating */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 animate-fade-in-up duration-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white tracking-tight">₹{activeProduct.price}</span>
                  {activeProduct.originalPrice && Number(activeProduct.originalPrice) > Number(activeProduct.price) ? (
                    <span className="text-lg text-white/65 line-through">₹{activeProduct.originalPrice}</span>
                  ) : null}
                </div>


                <div className="h-6 w-px bg-white/20" />
                <div className="flex items-center gap-1.5">
                  <Star size={16} className={activeProduct.reviews > 0 ? "text-amber-400 fill-amber-400" : "text-white/40 fill-white/40"} />
                  {activeProduct.reviews > 0 ? (
                    <>
                      <span className="text-white font-semibold">{activeProduct.rating}</span>
                      <span className="text-white/70 text-sm">({activeProduct.reviews} {activeProduct.reviews === 1 ? "review" : "reviews"})</span>
                    </>
                  ) : (
                    <span className="text-white/70 text-sm font-medium">No reviews</span>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-fade-in-up duration-900">
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding || added}
                  className={`group inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5 ${
                    activeProduct.inventory && activeProduct.inventory.quantity <= 0 ? "bg-gray-500 cursor-not-allowed" : added ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25" : "bg-brand-gold hover:bg-brand-gold-dark shadow-brand-gold/25"
                  }`}
                >
                    <div className="flex items-center gap-2">
                      {!added && <ShoppingBag size={18} />}
                      <span className="text-xl font-bold">
                        {activeProduct.inventory && activeProduct.inventory.quantity <= 0 ? "Out of Stock" : (added ? "Added!" : "Add to Cart")}
                      </span>
                    </div>
                </button>
                <Link
                  href={`/product/${activeProduct.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 hover:border-brand-gold text-white hover:text-brand-gold font-semibold rounded-full transition-all duration-300"
                >
                  View Details
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Giant Circular Sector & Outer Orbit Controls */}
          <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end h-[350px] sm:h-[500px] lg:h-[800px] mt-10 lg:mt-0">
            
            {/* 1. Giant Half-Circle Image Display Mask */}
            <div
              className="absolute rounded-full border-[6px] sm:border-[10px] border-brand-gold/30 bg-brand-brown-light overflow-hidden transition-all duration-1000"
              style={{
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
                right: radius < 400 ? "50%" : `-${radius}px`,
                transform: radius < 400 ? "translate(50%, -50%)" : "translateY(-50%)",
                top: "50%",
                boxShadow: "0 0 60px rgba(0, 0, 0, 0.4), inset 0 0 40px rgba(0,0,0,0.5)",
              }}
            >
              {/* Product Images Cross-Fading with Slow Cinematic Zoom (Ken Burns effect) */}
              {realProducts.map((product, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={product.id}
                    className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
                      isActive 
                        ? "opacity-100 z-10 scale-100" 
                        : "opacity-0 z-0 scale-95"
                    }`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className={`object-cover transition-transform duration-[5000ms] ease-out ${
                        isActive ? "scale-110" : "scale-105"
                      }`}
                      sizes="1000px"
                      priority={idx === 0}
                    />
                    {/* Subtle dark gradient overlay to blend into background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-brown/40 via-transparent to-transparent mix-blend-multiply z-10" />
                  </div>
                );
              })}
            </div>

            {/* 2. Orbiting Selectors Overlay */}
            <div
              className="absolute rounded-full pointer-events-none transition-transform duration-[1000ms] cubic-bezier(0.4, 0, 0.2, 1)"
              style={{
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
                transform: `rotate(-${rotationStep * 60}deg)`,
                right: radius < 400 ? "50%" : `-${radius}px`,
                marginRight: radius < 400 ? `-${radius}px` : "0",
                top: "50%",
                marginTop: `-${radius}px`,
                zIndex: 20,
              }}
            >
              {/* Product selector nodes placed on the circle rim */}
              {realProducts.map((product, idx) => {
                const angle = baseAngle + idx * 60; // Dynamic base angle based on screen size
                const isActive = idx === activeIndex;

                return (
                  <div
                    key={product.id}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                    style={{
                      transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg) rotate(${rotationStep * 60}deg)`,
                    }}
                  >
                    {/* Compact circular thumbnail selector */}
                    <button
                      onClick={() => handleSelectProduct(idx)}

                      className={`relative flex items-center justify-center rounded-full overflow-hidden transition-all duration-700 focus:outline-none ${
                        isActive
                          ? "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-4 border-brand-gold shadow-2xl scale-110"
                          : "w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-2 border-white/60 hover:border-brand-gold opacity-75 hover:opacity-100 hover:scale-105 bg-brand-brown-light"
                      }`}
                      style={{
                        boxShadow: isActive ? "0 0 25px rgba(195, 154, 95, 0.5)" : "0 4px 10px rgba(0,0,0,0.3)"
                      }}
                      aria-label={`Select ${product.name}`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                      {/* Active indicator ping */}
                      {isActive && (
                        <div className="absolute inset-0 border-2 border-white/40 rounded-full animate-ping pointer-events-none" />
                      )}
                    </button>

                    {/* Small product title tooltips visible for inactive items */}
                    {!isActive && (
                      <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-brand-brown-light/90 border border-brand-gold/20 text-white text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none shadow-md z-30">
                        {product.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 3. Glowing Active Ring Overlay Frame at the active peak position (fixed, does not rotate) */}
            <div
              className="absolute border-[4px] border-brand-gold rounded-full pointer-events-none z-30 animate-pulse"
              style={
                radius < 400
                  ? {
                      width: `${thumbSize + 16}px`,
                      height: `${thumbSize + 16}px`,
                      left: "50%",
                      top: "50%",
                      transform: `translate(-50%, calc(-50% + ${radius}px))`,
                      boxShadow: "0 0 25px rgba(195, 154, 95, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.3)",
                    }
                  : {
                      width: `${thumbSize + 16}px`,
                      height: `${thumbSize + 16}px`,
                      right: `${radius - (thumbSize + 16) / 2}px`,
                      top: "50%",
                      transform: "translateY(-50%)",
                      boxShadow: "0 0 25px rgba(195, 154, 95, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.3)",
                    }
              }
            />

            {/* Glowing Spotlight Overlay directly behind the active product selector */}
            <div
              className="absolute w-40 sm:w-56 h-40 sm:h-56 rounded-full bg-brand-gold/30 blur-3xl pointer-events-none z-0"
              style={
                radius < 400
                  ? {
                      left: "50%",
                      top: "50%",
                      transform: `translate(-50%, calc(-50% + ${radius}px))`,
                    }
                  : {
                      right: `${radius}px`,
                      top: "50%",
                      transform: "translate(50%, -50%)",
                    }
              }
            />

            {/* Glowing Accent Ring tracing the outer edge of the half circle */}
            <div
              className="absolute border border-brand-gold/15 rounded-full pointer-events-none z-0 hidden lg:block"
              style={{
                width: `${radius * 2 + 60}px`,
                height: `${radius * 2 + 60}px`,
                right: `-${radius + 30}px`,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />

          </div>

        </div>
      </div>
    </section>
  );
}
