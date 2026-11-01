import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions — Thar Delight",
  description: "Terms and conditions governing the use of the Thar Delight website and online orders.",
};

export default function TermsPage() {
  return (
    <div className="bg-brand-warm-white min-h-screen py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-2">Legal & Governance</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-brown font-bold mb-4">Terms & Conditions</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Last updated: November 2026. Please read these terms carefully before placing an order with Thar Delight.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-sand/60 shadow-sm space-y-8 text-brand-brown/90 leading-relaxed text-sm sm:text-base">
          
          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using the website of <strong>Thar Delight</strong> (referred to as &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) or purchasing our products, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">2. Products & Nutritional Integrity</h2>
            <p className="mb-2">
              We specialize in wholesome millet cookies, traditional farali snacks, and handcrafted wooden serveware sourced from Rajasthan. All consumable products are prepared using natural ingredients without artificial preservatives.
            </p>
            <p>
              While we make every effort to display accurate images, descriptions, weights, and nutritional information, slight variations may occur due to traditional small-batch manufacturing.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">3. Pricing & Payment</h2>
            <p className="mb-2">
              All prices displayed on the website are in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST) unless specified otherwise. Shipping charges are calculated at checkout.
            </p>
            <p>
              We accept online payments through secure, RBI-authorized payment aggregators (UPI, Credit/Debit Cards, Net Banking) powered by Razorpay, as well as Cash on Delivery (COD) for eligible pincodes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">4. Order Acceptance & Fulfillment</h2>
            <p>
              Receipt of an electronic order confirmation does not signify our final acceptance of your order. Thar Delight reserves the right to cancel or limit order quantities in cases of suspected fraud, pricing errors, or stock unavailability. If your order is cancelled after payment, a full refund will be processed promptly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">5. Intellectual Property</h2>
            <p>
              All content on this site, including logos, trademarks, text, graphics, photography, and recipe names, is the exclusive property of Thar Delight and protected by Indian intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-3">6. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and Conditions and any disputes arising out of or related to your transactions with Thar Delight shall be governed by and construed in accordance with the laws of India, with exclusive jurisdiction in the courts of <strong>Jodhpur, Rajasthan</strong>.
            </p>
          </section>

          <section className="pt-4 border-t border-brand-sand/40">
            <h2 className="font-serif text-xl font-bold text-brand-brown mb-2">7. Contact Information</h2>
            <p className="text-sm text-gray-600">
              For any questions regarding these Terms & Conditions, please contact us at:
            </p>
            <p className="mt-2 text-sm text-brand-brown font-medium">
              Thar Delight Customer Support<br />
              D-15, Rameshwar Nagar, Jodhpur, Rajasthan, India — 342001<br />
              Email: <a href="mailto:thardelight@gmail.com" className="text-brand-gold hover:underline">thardelight@gmail.com</a> | Phone: +91 89551 43139
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

