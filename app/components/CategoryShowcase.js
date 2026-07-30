import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getCategoriesWithProductCount } from "@/app/actions/product-actions";

const categoryStyleMap = {
  "millet-cookies": { color: "from-amber-700 to-amber-900", image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395004/thar-delight/categories/millet-cookies.jpg" },
  "millet-snacks": { color: "from-yellow-600 to-yellow-800", image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395005/thar-delight/categories/snacks.jpg" },
  "farali": { color: "from-orange-600 to-orange-800", image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395006/thar-delight/categories/farali-cookies.jpg" },
  "wooden-craft": { color: "from-stone-600 to-stone-800", image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395007/thar-delight/categories/wooden-craft.jpg" },
};


export default async function CategoryShowcase() {
  const dbCategories = await getCategoriesWithProductCount();

  const categories = dbCategories.map((c) => {
    const style = categoryStyleMap[c.slug] || {
      color: "from-amber-700 to-amber-900",
      image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395004/thar-delight/categories/millet-cookies.jpg",
    };
    return {
      ...c,
      color: style.color,
      image: style.image,
    };
  });

  return (
    <section className="py-20 sm:py-24 bg-brand-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-[0.2em]">
            Browse Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-brown mt-3 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            From wholesome millet treats to handcrafted wooden treasures —
            explore our curated collections from the heart of Rajasthan.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto gap-6 stagger-children">

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[3/4] border border-brand-sand/65 shadow-md hover:shadow-xl hover:border-brand-gold/20 transition-all duration-500"
            >
              {/* Category Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Colored overlay blending with theme */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} mix-blend-multiply opacity-55 group-hover:opacity-40 transition-opacity duration-500`} />
                {/* Bottom dark shadow gradient to make the text highly readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10" />
              </div>

              {/* Decorative pattern overlay */}
              <div className="absolute inset-0 opacity-5 z-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }} />
              </div>

              {/* Content Box */}
              <div className="relative h-full flex flex-col justify-end p-6 z-20">

                <h3 className="font-serif text-2xl !text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-white/70 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">
                    {category.productCount} Products
                  </span>
                  <span className="flex items-center gap-1 text-brand-gold text-sm font-semibold opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Explore
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

