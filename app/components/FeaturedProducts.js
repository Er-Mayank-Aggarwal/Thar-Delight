import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { getFeaturedProducts } from "@/app/actions/product-actions";

export default async function FeaturedProducts() {
  const featured = await getFeaturedProducts();

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center justify-center mb-20 gap-4">
          <div>
            <span className="text-brand-gold text-sm font-semibold uppercase tracking-[0.2em]">
              Handpicked for You
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-brown mt-3">
              Featured Products
            </h2>
          </div>
        </div>

        {/* Product Carousel / Grid */}
        <div className="flex sm:flex-wrap overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none justify-start sm:justify-center gap-4 sm:gap-8 pb-4 sm:pb-0 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {featured.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[80vw] max-w-[280px] sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {/* View All Products Button */}
        <div className="flex justify-center mt-12 sm:mt-14">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-white text-sm font-semibold rounded-full shadow-md shadow-brand-gold/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            View All Products
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>

  );
}
