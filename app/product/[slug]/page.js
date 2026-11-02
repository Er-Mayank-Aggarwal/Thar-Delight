import Link from "next/link";
import { getRelatedProducts, getFeaturedProducts } from "@/app/actions/product-actions";
import { getProductBySlugCached } from "@/lib/queries/products";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlugCached(slug);
  if (!product) {
    return { title: "Product Not Found — Thar Delight" };
  }

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395003/thar-delight/placeholder.jpg";
  const desc =
    product.seoDescription ||
    product.shortDescription ||
    product.description?.slice(0, 160) ||
    "Artisanal millet cookies and treats from Rajasthan.";

  return {
    title: product.seoTitle || product.name,
    description: desc,
    openGraph: {
      title: product.seoTitle || product.name,
      description: desc,
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle || product.name,
      description: desc,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetail({ params }) {
  const { slug } = await params;
  const product = await getProductBySlugCached(slug);

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-brand-warm-white flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">🍪</span>
        <h2 className="font-serif text-3xl text-brand-brown mb-2 font-bold">Product Not Found</h2>
        <p className="text-gray-400 text-sm max-w-xs mb-8">
          The product you are looking for might have been moved or renamed.
        </p>
        <Link
          href="/shop"
          className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-white text-sm font-semibold rounded-full transition-all"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  // Fetch related and recommended products in parallel
  const [relatedProducts, featuredProducts] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 3),
    getFeaturedProducts(),
  ]);

  const recommendedProducts = featuredProducts
    .filter((feat) => feat.id !== product.id)
    .slice(0, 3);

  // Schema.org Structured Data
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "";
  const inStock = (product.inventory?.quantity ?? 0) > 0;
  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((img) => img.url) || [primaryImage],
    description: product.description,
    sku: product.sku || product.slug,
    brand: {
      "@type": "Brand",
      name: "Thar Delight",
    },
    offers: {
      "@type": "Offer",
      url: `https://thardelight.com/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(avgRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            reviewCount: product.reviews.length,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        recommendedProducts={recommendedProducts}
      />
    </>
  );
}
