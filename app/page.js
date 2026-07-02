import HeroSection from "./components/HeroSection";
import CategoryShowcase from "./components/CategoryShowcase";
import FeaturedProducts from "./components/FeaturedProducts";
import ValuesSection from "./components/ValuesSection";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <FeaturedProducts />
      <ValuesSection />

      {/* CTA Banner */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-brown via-brand-brown-light to-brand-brown" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(195,154,95,0.15),transparent_70%)]" />

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl !text-white mb-6 leading-tight">
            Ready to Taste the
            <span className="text-brand-gold"> Authentic Flavors</span>?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of happy customers who have made Thar Delight a part
            of their healthy lifestyle. Order now and get free shipping on your
            first purchase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-brand-gold/25 hover:-translate-y-0.5 text-lg"
            >
              Explore the Shop
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/20 text-white hover:border-brand-gold hover:text-brand-gold font-semibold rounded-full transition-all duration-300 text-lg"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
