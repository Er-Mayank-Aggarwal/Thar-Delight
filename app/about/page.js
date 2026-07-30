"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldAlert, Users, Award } from "lucide-react";

export default function About() {
  return (
    <div className="bg-brand-warm-white">
      {/* Hero Header */}
      <section className="relative bg-brand-brown py-20 lg:py-28 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(195,154,95,0.15),transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto px-4 z-10 space-y-4">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-[0.2em] block">
            Our Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl !text-white leading-tight">
            Rooted in Tradition, Crafted with Love
          </h1>
          <p className="text-white/85 text-lg leading-relaxed max-w-xl mx-auto">
            Bringing you the authentic flavors of millet cookies and handcrafted woodware from the heart of the Thar Desert.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Image display */}
            <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-brand-cream border border-brand-sand shadow-lg">
              <Image
                src="https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395008/thar-delight/products/ajwain-millet-cookies.jpg"
                alt="Baking traditional cookies"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-brand-brown/10 mix-blend-multiply" />
            </div>

            {/* Narrative text */}
            <div className="space-y-6 text-gray-500 leading-relaxed text-base">
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-brown mb-4 leading-tight">
                Our Journey From Jodhpur to Your Home
              </h2>
              <p>
                Thar Delight began with a simple vision: to celebrate the rich culinary heritage and craft legacy of Rajasthan. In the arid terrains of the Thar Desert, communities have thrived for centuries on nutritious, hardy millets like Bajra and amaranth, alongside the rugged Acacia wood trees.
              </p>
              <p>
                We wanted to bring these traditional wonders to the modern lifestyle. Our recipes use wholesome millets, organic sweeteners, and pure ghee, baked without any artificial chemical preservatives. Every product is a tribute to health, authenticity, and clean eating.
              </p>
              <p>
                We collaborate directly with rural farming groups and traditional woodcarvers, securing fair pricing structures and nurturing craft legacies that have been passed down for generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values/Pillars Section */}
      <section className="py-20 sm:py-24 bg-brand-cream/40 border-y border-brand-sand/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-gold text-sm font-semibold uppercase tracking-[0.2em]">
              The Core Pillars
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-brown mt-3">
              What Defines Thar Delight
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-brand-sand/50 text-center space-y-4">
              <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-xl mb-2">
                <Leaf size={24} />
              </div>
              <h3 className="font-serif text-xl text-brand-brown font-semibold">100% Organic Sourcing</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                We work directly with certified farming co-operatives in Rajasthan, sourcing raw millets harvested using dryland irrigation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-brand-sand/50 text-center space-y-4">
              <div className="inline-flex p-3 bg-brand-gold/10 text-brand-gold rounded-xl mb-2">
                <Users size={24} />
              </div>
              <h3 className="font-serif text-xl text-brand-brown font-semibold">Artisanal Empowerment</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Our wooden plates and serveware are sculpted by traditional woodworkers in desert villages, sustaining ancient crafts.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-brand-sand/50 text-center space-y-4">
              <div className="inline-flex p-3 bg-amber-50 text-amber-600 rounded-xl mb-2">
                <Award size={24} />
              </div>
              <h3 className="font-serif text-xl text-brand-brown font-semibold">Zero-Additive Guarantee</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                No chemical preservatives, zero palm oil, and no high-fructose corn syrups. Only clean, pure ingredients you understand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-brand-brown text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl !text-white">
            Support Local Craftsmanship
          </h2>
          <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Every purchase you make directly supports the livelihood of dryland farmers and craftspeople in the desert villages of Rajasthan.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-brand-gold/20"
            >
              Explore Our Store
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
