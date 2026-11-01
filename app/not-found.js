import Link from "next/link";
import { Home, ShoppingBag, Search } from "lucide-react";

export const metadata = {
  title: "Page Not Found — Thar Delight",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center animate-fade-in-up">
        {/* 404 Number */}
        <div className="relative mb-6">
          <span className="text-[120px] sm:text-[160px] font-serif font-bold text-brand-cream leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-16 h-16 text-brand-gold/40" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl text-brand-brown mb-3 -mt-4">
          Page Not Found
        </h1>

        {/* Message */}
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you&apos;re looking for seems to have wandered off into the
          Thar desert. Let&apos;s help you find your way back.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/25 hover:-translate-y-0.5"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-brown/10 text-brand-brown hover:border-brand-gold hover:text-brand-gold font-semibold rounded-full transition-all duration-300"
          >
            <ShoppingBag size={18} />
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
