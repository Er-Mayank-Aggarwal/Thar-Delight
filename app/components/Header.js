"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled past 20px
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide navbar when scrolling DOWN past 150px, show immediately when scrolling UP anywhere
      if (currentScrollY > 150 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        {/* Top Announcement Bar */}
        <div
          className={`bg-brand-brown text-brand-cream text-center transition-all duration-300 tracking-wide ${isScrolled
            ? "h-0 py-0 opacity-0 overflow-hidden"
            : "py-2 px-4 text-xs sm:text-sm opacity-100"
            }`}
        >
          <p>
            🌾 Free shipping on orders above ₹500 🌾{" "}
            {/* <span className="text-brand-gold font-semibold">
              Use code THAR10 for 10% off
            </span> */}
          </p>
        </div>

        {/* Main Header */}
        <header
          className={`transition-all duration-300 border-b border-brand-sand/40 ${isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg shadow-black/5"
            : "bg-white shadow-sm"
            }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`flex items-center justify-between transition-all duration-300 ease-in-out ${isScrolled ? "h-16" : "h-20 sm:h-24"
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
                    className={`w-auto transition-all duration-500 ease-in-out group-hover:scale-102 ${isScrolled
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
                  className="p-2 text-brand-brown hover:text-brand-gold transition-colors block"
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

          {/* Search Modal Overlay */}
          {isSearchOpen && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div 
                className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-sand/60 relative animate-scale-up"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-brand-sand/40">
                  <h3 className="font-serif text-lg text-brand-brown font-semibold flex items-center gap-2">
                    <Search size={18} className="text-brand-gold" />
                    Search Thar Delight
                  </h3>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-brand-brown hover:bg-brand-cream rounded-full transition-all"
                    aria-label="Close search"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSearchSubmit} className="relative mb-6">
                  <div className="relative flex items-center">
                    <Search size={22} className="absolute left-5 text-brand-gold" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search cookies, snacks, farali treats..."
                      className="w-full pl-14 pr-24 py-4 bg-brand-cream/60 border border-brand-sand/50 rounded-2xl text-brand-brown font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white text-base sm:text-lg transition-all"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-24 text-gray-400 hover:text-brand-brown text-xs font-semibold px-2 py-1"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-3 px-5 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-brand-gold/20"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Quick Search Suggestions */}
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "🍪 Millet Cookies", query: "millet-cookies" },
                      { name: "✨ Millet Snacks", query: "millet-snacks" },
                      { name: "🌾 Farali", query: "farali" },
                      { name: "Ajwain Cookies", query: "ajwain" },
                      { name: "Dark Chocolate", query: "chocolate" },
                    ].map((tag) => (
                      <button
                        key={tag.name}
                        onClick={() => {
                          router.push(`/shop?search=${encodeURIComponent(tag.query)}`);
                          setIsSearchOpen(false);
                        }}
                        className="px-3.5 py-1.5 bg-brand-cream hover:bg-brand-gold/15 text-brand-brown hover:text-brand-gold rounded-full text-xs font-semibold border border-brand-sand/40 transition-all"
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Click outside to close */}
              <div className="absolute inset-0 -z-10" onClick={() => setIsSearchOpen(false)} />
            </div>
          )}

        </header>
      </div>

      {/* Spacer to prevent page content overlap under fixed header */}
      <div className="h-28 sm:h-32" />


      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-[100] lg:hidden backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-brand-brown z-[110] lg:hidden overflow-y-auto shadow-2xl animate-slide-in-right">
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="text-brand-gold font-serif text-xl font-bold">Thar Delight</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-white/70 hover:text-white transition-colors bg-white/5 rounded-full"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 px-6 py-8">
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="block py-3 text-lg font-semibold tracking-wide text-white/80 hover:text-brand-gold hover:translate-x-2 transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile Footer / Social */}
              <div className="p-6 border-t border-white/10 bg-black/10">
                <p className="text-xs text-white/50 uppercase tracking-widest mb-4 font-semibold">Connect with us</p>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/p/Thar-Delight-100090154441026/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-gold transition-all"
                    aria-label="Facebook"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                </div>
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
