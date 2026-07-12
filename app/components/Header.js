"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-brand-brown text-brand-cream text-center py-2 px-4 text-xs sm:text-sm tracking-wide">
        <p>
          🌾 Free shipping on orders above ₹500 |{" "}
          <span className="text-brand-gold font-semibold">
            Use code THAR10 for 10% off
          </span>
        </p>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 border-b border-brand-sand/40 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md shadow-black/5"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
              isScrolled ? "h-16" : "h-24 sm:h-28"
            }`}
          >
            {/* Left: Mobile Menu Toggle & Logo */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-brand-brown hover:text-brand-gold transition-colors -ml-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo (aligned left) */}
              <Link href="/" className="flex-shrink-0 group flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="Thar Delight"
                  width={200}
                  height={200}
                  className={`w-auto transition-all duration-500 ease-in-out group-hover:scale-102 ${
                    isScrolled
                      ? "h-10 sm:h-11" // Compact logo on scroll
                      : "h-14 sm:h-18 lg:h-20" // Large logo at top
                  }`}
                  priority
                />
              </Link>
            </div>

            {/* Center: Navigation Links (Desktop) */}
            <nav className="hidden lg:block">
              <ul className="flex items-center gap-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="relative px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-brown hover:text-brand-gold transition-colors duration-300 group"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-3/4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right: Utility Icons (Right-aligned) */}
            <div className="flex items-center gap-1 sm:gap-3 justify-end">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-brand-brown hover:text-brand-gold transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="p-2 text-brand-brown hover:text-brand-gold transition-colors hidden sm:block"
                aria-label="My Account"
              >
                <User size={20} />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-brand-brown hover:text-brand-gold transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={20} />
                {cartCount >= 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute inset-x-0 top-full bg-white shadow-xl border-t border-brand-sand animate-fade-in-up">
            <div className="max-w-2xl mx-auto p-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, categories..."
                  className="w-full px-6 py-4 bg-brand-cream rounded-full text-brand-brown placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 text-lg"
                  autoFocus
                />
                <Search
                  size={20}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-gold"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-80 bg-brand-brown z-50 lg:hidden transform transition-transform duration-300 overflow-y-auto">
            <div className="p-6">
              {/* Close */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/80 hover:text-white mb-8"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>

              {/* Mobile Nav Links */}
              <nav>
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="block py-4 text-xl font-serif text-white/80 hover:text-brand-gold border-b border-white/10 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile Social */}
              <div className="mt-10 flex gap-4">
                <a
                  href="https://www.facebook.com/p/Thar-Delight-100090154441026/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-gold transition-all"
                  aria-label="Facebook"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/thar.delight/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-gold transition-all"
                  aria-label="Instagram"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
