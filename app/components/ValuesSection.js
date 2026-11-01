"use client";

import { useState } from "react";
import { Leaf, Heart, Shield, Truck } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Made from organically sourced millets and ingredients with zero artificial additives.",
  },
  {
    icon: Heart,
    title: "Handcrafted with Love",
    description: "Every product is carefully crafted by skilled artisans from the Thar desert region.",
  },
  {
    icon: Shield,
    title: "No Preservatives",
    description: "We use only traditional preservation methods. Pure, clean, and wholesome goodness.",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    description: "Fast, secure delivery across India. Free shipping on orders above ₹1,000.",
  },
];

export default function ValuesSection() {
  return (
    <section className="py-20 sm:py-24 bg-brand-cream relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-[0.2em]">
            Why Choose Us
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-brown mt-3 mb-4">
            The Thar Delight Promise
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We believe in bringing you the finest quality products that honor
            traditional craftsmanship while meeting modern standards.
          </p>
        </div>

        {/* Values Grid (All entry animations and hover translations/rotations removed) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-7 text-center border border-brand-sand/60 shadow-sm"
              >
                {/* Icon (static) */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-gold/10 text-brand-gold mb-5">
                  <Icon size={24} />
                </div>

                <h3 className="font-serif text-xl text-brand-brown mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
