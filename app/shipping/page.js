import Link from "next/link";
import { Truck, Clock, ShieldCheck, MapPin } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy — Thar Delight",
  description: "Shipping timelines, delivery charges, and courier partners for Thar Delight orders across India.",
};

export default function ShippingPage() {
  return (
    <div className="bg-brand-warm-white min-h-screen py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-2">Delivery Information</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-brown font-bold mb-4">Shipping & Delivery Policy</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            From the heart of the Thar desert directly to your doorstep. Here is everything you need to know about our shipping process.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-brand-sand/60 text-center">
            <Clock className="w-8 h-8 text-brand-gold mx-auto mb-2" />
            <h3 className="font-serif font-bold text-brand-brown text-base">24-48 Hours Dispatch</h3>
            <p className="text-xs text-gray-500 mt-1">Freshly baked in small batches and packed with care</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-brand-sand/60 text-center">
            <Truck className="w-8 h-8 text-brand-gold mx-auto mb-2" />
            <h3 className="font-serif font-bold text-brand-brown text-base">3-7 Business Days</h3>
            <p className="text-xs text-gray-500 mt-1">Pan-India delivery via premier courier networks</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-brand-sand/60 text-center">
            <ShieldCheck className="w-8 h-8 text-brand-gold mx-auto mb-2" />
            <h3 className="font-serif font-bold text-brand-brown text-base">Damage-Free Guarantee</h3>
            <p className="text-xs text-gray-500 mt-1">Triple-layer protective packaging for crunchy cookies</p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-sand/60 shadow-sm space-y-8 text-brand-brown/90 leading-relaxed text-sm sm:text-base">
          
          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">1. Order Processing & Dispatch Timelines</h2>
            <p>
              All orders are processed and freshly packed from our facility in Jodhpur, Rajasthan within <strong>24 to 48 hours</strong> (excluding Sundays and national holidays). During festive seasons or high-demand periods, order processing may take an additional 24 hours.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">2. Delivery Timeframes</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li><strong>Within Rajasthan / North India:</strong> 2 to 4 business days post-dispatch.</li>
              <li><strong>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Pune, Hyderabad, Kolkata):</strong> 3 to 5 business days.</li>
              <li><strong>Rest of India & Remote Locations:</strong> 5 to 7 business days.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">3. Shipping Charges</h2>
            <p className="mb-2">
              We offer <strong>Free Standard Shipping</strong> on all domestic orders with a cart value exceeding <strong>₹1,000</strong>.
            </p>
            <p>
              For orders below ₹1,000, a flat delivery fee of <strong>₹100</strong> is applied at checkout to cover courier logistics and protective transit packaging.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">4. Courier Partners & Tracking</h2>
            <p className="mb-3">
              We partner with trusted express couriers including Delhivery, Blue Dart, DTDC, and India Post Speed Post. Once your parcel is dispatched, you will receive an automated tracking link via email/SMS.
            </p>
            <p>
              You can also track your shipment status anytime using our <Link href="/track" className="text-brand-gold font-semibold underline">Track Order</Link> page.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">5. Delivery Attempts & Failed Deliveries</h2>
            <p>
              Our courier partners attempt delivery up to three times. Please ensure accurate contact numbers and address details at checkout. If a package is returned to origin due to incorrect address or customer unavailability, re-shipping charges may apply.
            </p>
          </section>

          <section className="pt-4 border-t border-brand-sand/40">
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-2">Shipping Support</h2>
            <p className="text-sm text-gray-600">
              Need assistance with an existing parcel? Reach our logistics desk:
            </p>
            <p className="mt-2 text-sm text-brand-brown font-medium">
              Email: <a href="mailto:thardelight@gmail.com" className="text-brand-gold hover:underline">thardelight@gmail.com</a> | WhatsApp/Phone: +91 89551 43139
            </p>
          </section>

        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-sm font-semibold text-brand-gold hover:text-brand-gold-dark transition-colors">
            ← Return to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

