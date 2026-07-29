"use client";

import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, loading } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-sand/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-brand-brown" size={20} />
            <h2 className="font-serif text-xl text-brand-brown">Your Cart</h2>
            <span className="bg-brand-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-brand-brown hover:bg-brand-cream rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-brand-sand border-t-brand-gold rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium animate-pulse">Loading cart...</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center text-brand-gold">
                <ShoppingBag size={32} />
              </div>
              <div>
                <p className="text-lg font-serif text-brand-brown mb-1">Your cart is empty</p>
                <p className="text-sm text-gray-500">Looks like you haven't added anything yet.</p>
              </div>
              <Link 
                href="/shop"
                onClick={onClose}
                className="mt-4 px-8 py-3 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold text-sm rounded-full transition-all duration-300 shadow-md shadow-brand-gold/20 hover:-translate-y-0.5"
              >
                Shop Now
              </Link>

            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl border border-brand-sand/30 shadow-sm relative group">
                <div className="relative w-20 h-20 bg-brand-cream rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || item.images?.[0]?.url || "/images/placeholder.png"}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                    <h3 className="text-sm font-medium text-brand-brown line-clamp-1 pr-6">
                      {(item.name || "").split("|")[0].trim()}
                    </h3>
                    <p className="text-sm font-bold text-brand-brown mt-1">₹{item.price}</p>

                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-brand-cream rounded-lg border border-brand-sand/40">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-brand-brown hover:text-brand-gold transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-brand-brown">
                        {item.quantity}
                      </span>
                      {(() => {
                        const maxStock = item.inventory?.quantity ?? item.stock ?? item.quantityInStock ?? 999;
                        const isMax = item.quantity >= maxStock;
                        return (
                          <button 
                            onClick={() => !isMax && updateQuantity(item.id, item.quantity + 1)}
                            disabled={isMax}
                            className={`p-1.5 transition-colors ${
                              isMax ? "text-gray-300 cursor-not-allowed" : "text-brand-brown hover:text-brand-gold"
                            }`}
                            title={isMax ? `Max stock (${maxStock}) reached` : "Increase quantity"}
                          >
                            <Plus size={14} />
                          </button>
                        );
                      })()}
                    </div>

                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-brand-sand/30 bg-white">
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>{cartTotal > 500 ? "Free" : "Calculated at checkout"}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-brand-brown pt-3 border-t border-dashed border-brand-sand">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <Link 
              href="/checkout"
              onClick={onClose}
              className="w-full py-4 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-brand-gold/20"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
