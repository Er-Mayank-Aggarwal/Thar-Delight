"use client";

import { useEffect, useState } from "react";
import { getRecentSales } from "@/app/actions/store-actions";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";

export default function RecentSalesNotification() {
  const pathname = usePathname();
  const [sales, setSales] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  // Don't show in admin area or if user manually dismissed it
  const shouldRender = !pathname?.startsWith("/admin-controls") && !hasDismissed;

  useEffect(() => {
    if (!shouldRender) return;

    // Fetch recent sales on mount
    getRecentSales().then((data) => {
      if (data && data.length > 0) {
        setSales(data);
      }
    });
  }, [shouldRender]);

  useEffect(() => {
    if (sales.length === 0 || !shouldRender) return;

    // Initial delay before showing the notification
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      
      // Auto-hide after 6 seconds
      setTimeout(() => {
        setIsVisible(false);
        setHasDismissed(true);
      }, 6000);
    }, 3000);

    return () => {
      clearTimeout(initialTimer);
    };
  }, [sales, shouldRender]);

  if (sales.length === 0 || !shouldRender) return null;

  const currentSale = sales[0]; // Now we only have 1 sale
  
  // Format time ago (simplified)
  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 60000);
    if (diff < 60) return `${diff} min ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Recently';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:bottom-6 z-50 w-[calc(100%-2rem)] sm:w-96 max-w-sm shadow-2xl rounded-2xl bg-white border border-brand-sand/50 overflow-hidden flex"
        >
          {/* Left accent bar */}
          <div className="w-1.5 bg-brand-gold shrink-0" />
          
          <div className="p-3 sm:p-4 flex items-start gap-3 w-full relative">
            <button 
              onClick={() => {
                setIsVisible(false);
                setHasDismissed(true);
              }}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white/50 rounded-full"
            >
              <X size={16} />
            </button>

            {currentSale.imageUrl ? (
              <img 
                src={currentSale.imageUrl} 
                alt={currentSale.productName} 
                className="w-12 h-12 rounded-lg object-cover border border-brand-sand/30 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-brand-cream flex items-center justify-center shrink-0 border border-brand-sand/30 text-brand-gold">
                <ShoppingBag size={20} />
              </div>
            )}

            <div className="flex-1 pr-6">
              <p className="text-xs text-gray-500 font-medium mb-0.5">
                {currentSale.firstName} {currentSale.city}{" "}
                <span className="text-gray-400 font-normal ml-1 whitespace-nowrap">
                  • {timeAgo(currentSale.timestamp)}
                </span>
              </p>
              <p className="text-sm font-serif text-brand-brown leading-snug line-clamp-2">
                Purchased <span className="font-semibold text-brand-gold-dark">{currentSale.productName}</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
