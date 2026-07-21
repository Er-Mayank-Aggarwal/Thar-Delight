"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Star, Shield, RotateCcw, Truck, Sparkles } from "lucide-react";
import { submitReview } from "@/app/actions/review-actions";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";

export default function ProductDetailClient({ product, relatedProducts, recommendedProducts }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [localReviews, setLocalReviews] = useState(product.reviews || []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    setReviewError("");
    
    const res = await submitReview({
      productId: product.id,
      rating: reviewRating,
      comment: reviewComment
    });

    if (res.success) {
      setReviewSuccess(true);
      setReviewComment("");
      setReviewRating(5);
      setLocalReviews(prev => [
        ...prev,
        { id: 'temp', rating: reviewRating, comment: reviewComment, user: { name: "You" }, createdAt: new Date().toISOString() }
      ]);
    } else {
      setReviewError(res.error);
    }
    setIsSubmittingReview(false);
  };

  // Dynamic specs based on product category
  const specDetails = {
    weight: product.category?.slug === "wooden-craft" ? "450g (Approx)" : "150g pack",
    shelfLife: product.category?.slug === "wooden-craft" ? "Lifetime" : "4 Months from mfg",
    allergens: product.category?.slug === "millet-cookies" 
      ? "Sesame, Dairy (Ghee). Baked in a facility that handles nuts." 
      : product.category?.slug === "snacks" 
      ? "Peanuts. Seasoned with traditional rock salt." 
      : "None",
    origin: "Jodhpur, Rajasthan, India",
    materials: product.category?.slug === "wooden-craft" 
      ? "100% Solid Acacia Wood" 
      : "Millets (Bajra/Amaranth/Jowar), Cow Ghee, Jaggery/Sugar",
  };

  const isOutOfStock = product.inventory && product.inventory.quantity <= 0;
  const cartItem = cart.find((item) => item.id === product.id);
  const imageUrl = product.image || product.images?.[0]?.url || "/images/placeholder.png";

  return (
    <div className="bg-brand-warm-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-gold font-semibold mb-8 group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Shop
        </Link>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-sand/60 shadow-md grid lg:grid-cols-12 gap-10 sm:gap-14 mb-14">
          
          {/* Left Column: Image Display */}
          <div className="lg:col-span-6 relative aspect-square rounded-2xl overflow-hidden bg-brand-cream border border-brand-sand/65">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-brand-gold text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md z-10 animate-pulse">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right Column: Text Information */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category tag */}
              <span className="text-xs text-brand-gold font-bold uppercase tracking-wider bg-brand-gold/10 px-3 py-1.5 rounded-full w-fit block">
                {product.category?.name || "Unknown"}
              </span>

              {/* Product Name */}
              <h1 className="font-serif text-3xl sm:text-4xl text-brand-brown font-bold leading-tight">
                {product.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex flex-wrap items-center gap-6 py-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-brand-brown">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <div className="h-6 w-px bg-brand-sand" />
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="text-brand-brown font-semibold text-sm">{product.rating || (localReviews.length > 0 ? (localReviews.reduce((sum, rev) => sum + rev.rating, 0) / localReviews.length).toFixed(1) : "5.0")}</span>
                  <span className="text-gray-400 text-xs sm:text-sm">({localReviews.length} customer reviews)</span>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Sizing & Add-to-cart panel */}
            <div className="border-t border-brand-sand pt-6 space-y-6">
              
              {/* Sizing description */}
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Pack Size: <span className="text-brand-brown font-bold ml-1">{specDetails.weight}</span>
              </div>

              {/* Quantity picker & buy button */}
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                {cartItem ? (
                  <div className="flex-1 w-full flex items-center justify-between border border-brand-sand bg-white text-brand-brown font-semibold rounded-full shadow-sm px-6 py-2">
                    <button
                      onClick={(e) => { e.preventDefault(); updateQuantity(product.id, cartItem.quantity - 1); }}
                      className="w-10 h-10 flex items-center justify-center bg-brand-cream hover:bg-brand-sand/30 rounded-full transition-colors text-xl"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="text-lg w-10 text-center">{cartItem.quantity}</span>
                    <button
                      onClick={(e) => { e.preventDefault(); updateQuantity(product.id, cartItem.quantity + 1); }}
                      className="w-10 h-10 flex items-center justify-center bg-brand-cream hover:bg-brand-sand/30 rounded-full transition-colors text-xl"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Quantity adjuster */}
                    <div className="flex items-center border border-brand-sand rounded-full overflow-hidden w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isOutOfStock}
                        className="px-4 py-2.5 text-gray-500 hover:bg-brand-cream hover:text-brand-brown transition-colors text-lg disabled:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-6 py-2 text-brand-brown font-bold text-base min-w-[50px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => {
                          if (product.inventory && quantity < product.inventory.quantity) {
                            setQuantity(quantity + 1);
                          }
                        }}
                        disabled={isOutOfStock || (product.inventory && quantity >= product.inventory.quantity)}
                        className="px-4 py-2.5 text-gray-500 hover:bg-brand-cream hover:text-brand-brown transition-colors text-lg disabled:opacity-50"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={() => {
                        if (isOutOfStock) return;
                        addToCart(product, quantity);
                        setAdded(true);
                        setTimeout(() => setAdded(false), 2000);
                      }}
                      disabled={isOutOfStock}
                      className={`w-full sm:flex-1 py-3.5 text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                        isOutOfStock 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : added 
                            ? "bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5 active:scale-95" 
                            : "bg-brand-gold hover:bg-brand-gold-dark hover:shadow-brand-gold/25 hover:-translate-y-0.5 active:scale-95"
                      }`}
                      aria-label="Add to cart"
                    >
                      {isOutOfStock ? (
                        "Out of Stock"
                      ) : added ? (
                        "Added to Cart!"
                      ) : (
                        <>
                          <ShoppingBag size={18} />
                          Add to Shopping Cart
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>

            </div>

            {/* trust tags */}
            <div className="grid grid-cols-3 gap-4 border-t border-brand-sand pt-6 text-[11px] sm:text-xs text-gray-400">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
                <Shield size={16} className="text-brand-gold" />
                <span>Secure Payments</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
                <RotateCcw size={16} className="text-brand-gold" />
                <span>Returnable Item</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
                <Truck size={16} className="text-brand-gold" />
                <span>Free Delivery Above ₹500</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tab Details Section */}
        <div className="bg-white rounded-3xl border border-brand-sand/60 shadow-md overflow-hidden mb-14">
          {/* Tab Selector Headers */}
          <div className="flex border-b border-brand-sand">
            {["description", "specifications", "shipping"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 capitalize focus:outline-none ${
                  activeTab === tab
                    ? "border-brand-gold text-brand-gold bg-brand-cream/10 font-bold"
                    : "border-transparent text-gray-400 hover:text-brand-brown"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Panel */}
          <div className="p-6 sm:p-8 text-sm sm:text-base leading-relaxed text-gray-500">
            {activeTab === "description" && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-brand-brown font-bold mb-2">Nutritional Benefits & Taste Profile</h3>
                <p>
                  Our {product.name} is deeply rooted in the traditional baking styles of Rajasthan. Made without refined wheat flour (maida), it leverages the natural nutritional profile of dryland millets.
                </p>
                <p>
                  Sweetened lightly using organic jaggery or brown sugar, it provides sustained energy without causing sugar crashes. It is high in essential iron, dietary fibers, and magnesium, making it a perfect healthy snack to accompany your chai times.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li>Prepared using traditional wooden methods & pure ingredients.</li>
                  <li>Baked in small batches to ensure crispness and maximum quality.</li>
                  <li>No palm oil, no trans fats, and zero high-fructose corn syrups.</li>
                </ul>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-brand-sand/50">
                      <th className="py-3 pr-4 font-semibold text-brand-brown-light w-1/3">Weight</th>
                      <td className="py-3 text-gray-500">{specDetails.weight}</td>
                    </tr>
                    <tr className="border-b border-brand-sand/50">
                      <th className="py-3 pr-4 font-semibold text-brand-brown-light">Ingredients</th>
                      <td className="py-3 text-gray-500">{specDetails.materials}</td>
                    </tr>
                    <tr className="border-b border-brand-sand/50">
                      <th className="py-3 pr-4 font-semibold text-brand-brown-light">Shelf Life</th>
                      <td className="py-3 text-gray-500">{specDetails.shelfLife}</td>
                    </tr>
                    <tr className="border-b border-brand-sand/50">
                      <th className="py-3 pr-4 font-semibold text-brand-brown-light">Allergen Declarations</th>
                      <td className="py-3 text-gray-500">{specDetails.allergens}</td>
                    </tr>
                    <tr className="border-b border-brand-sand/50">
                      <th className="py-3 pr-4 font-semibold text-brand-brown-light">Origin</th>
                      <td className="py-3 text-gray-500">{specDetails.origin}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-brand-brown font-bold mb-2">Delivery & Product Maintenance</h3>
                <p>
                  We dispatch our products from Jodhpur within 24 hours of receiving the order. Average delivery times are:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2 mb-4">
                  <li><strong>North India:</strong> 2-3 business days</li>
                  <li><strong>Rest of India:</strong> 4-5 business days</li>
                </ul>
                <p>
                  <strong>Storage Care:</strong> Since we do not add chemical preservatives, store the cookies/snacks in an airtight glass container immediately after opening to protect them from moisture and preserve their crunch.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Standalone Customer Feedback Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-sand/60 shadow-md mb-14">
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-brown font-bold mb-8 text-center">Customer Feedback</h2>
          
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Reviews List */}
            <div className="space-y-6">
              {(!localReviews || localReviews.length === 0) ? (
                <div className="bg-brand-cream/30 p-8 rounded-2xl text-center border border-brand-sand/40">
                  <span className="text-4xl block mb-3">💬</span>
                  <h3 className="font-serif text-xl text-brand-brown font-bold mb-2">No reviews yet</h3>
                  <p className="text-gray-500 text-sm">Be the first to review this product and share your experience!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {localReviews.map((review) => (
                    <div key={review.id} className="p-5 bg-white rounded-2xl border border-brand-sand shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold text-sm">
                            {(review.user?.name || "A").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-brand-brown block leading-tight">{review.user?.name || "Anonymous"}</span>
                            <span className="text-[11px] text-gray-400">{new Date(review.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata",  day: "numeric", month: "short", year: "numeric" })}</span>
                          </div>
                        </div>
                        <div className="flex items-center bg-brand-cream/50 px-2 py-1 rounded-full">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="bg-brand-warm-white p-6 sm:p-8 rounded-2xl border border-brand-sand/60 h-fit">
              <h3 className="font-serif text-xl text-brand-brown font-bold mb-6">Write a Review</h3>
              {reviewSuccess ? (
                <div className="p-6 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={24} className="text-emerald-600" />
                  </div>
                  <h4 className="font-bold mb-1">Thank You!</h4>
                  <p className="text-sm">Your feedback helps others make better choices.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-brand-brown mb-2">Overall Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            className={star <= reviewRating ? "text-brand-gold fill-brand-gold drop-shadow-sm" : "text-gray-200 fill-gray-200"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-brown mb-2">Your Experience</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-brand-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold text-sm bg-white resize-none transition-all"
                      placeholder="What did you like about this product?"
                    />
                  </div>
                  {reviewError && <p className="text-red-500 text-sm font-medium">{reviewError}</p>}
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-3.5 bg-brand-brown text-white text-sm font-bold tracking-wide rounded-xl hover:bg-brand-brown-light hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:shadow-none"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Products Grid */}
        {recommendedProducts.length > 0 && (
          <div className="space-y-8 mb-16 pt-8 border-t border-brand-sand/60">
            <div className="text-center">
              <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Handpicked For You</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-brown font-bold">Recommended Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8 pt-8 border-t border-brand-sand/60">
            <div className="text-center">
              <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Similar Items</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-brown font-bold">Related Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
