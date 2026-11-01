"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "What makes millet cookies healthier than regular wheat or maida cookies?",
    answer: "Millets (like Bajra, Jowar, and Ragi) are rich in dietary fiber, essential minerals (like iron and magnesium), and have a lower glycemic index compared to refined wheat flour (maida). This means they digest slowly, keeping you full longer and preventing sudden sugar spikes.",
  },
  {
    question: "Are your millet cookies gluten-free?",
    answer: "Yes! Millets are naturally gluten-free grains. We do not blend any wheat flour into our millet cookies, making them an excellent choice for individuals looking to reduce gluten in their diet. (Please check individual product labels for specific allergy declarations).",
  },
  {
    question: "What does 'Farali' mean?",
    answer: "'Farali' refers to food items prepared specifically for religious fasting (vrat) in India, where standard grains like wheat and rice are restricted. Our Farali cookies and snacks are crafted from fasting-compliant ingredients like amaranth flour (rajgira), barnyard millet (sama), pure cow ghee, and dry fruits.",
  },
  {
    question: "Do you use palm oil or artificial preservatives in your snacks?",
    answer: "Absolutely not. We are committed to pure, clean food. We do not use palm oil, high-fructose corn syrup, or artificial preservatives. We prepare our treats traditionally using pure cow ghee or cold-pressed oils, ensuring maximum health benefits.",
  },
  {
    question: "What is your shipping policy and delivery timeline?",
    answer: "We offer pan-India shipping. Shipping is FREE for all orders above ₹1,000; otherwise, a flat shipping charge of ₹100 applies. Orders are typically processed within 24 to 48 hours and delivered within 3-5 business days depending on your location.",
  },
  {
    question: "What is the shelf life of the cookies?",
    answer: "Our cookies have a shelf life of 4 months from the date of manufacture. Because we do not use artificial preservatives, we recommend storing them in a cool, dry place inside an airtight container once opened to maintain crispness.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="bg-brand-warm-white min-h-screen py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-brand-gold text-sm font-semibold uppercase tracking-[0.2em] block">
            Got Questions?
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-brown mt-3 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Find answers to commonly asked questions about our ingredients, fasting rules, woodware care, and shipping.
          </p>
        </div>

        {/* Accordion FAQ Grid */}
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-brand-sand/60 overflow-hidden shadow-sm hover:border-brand-gold/30 transition-all duration-300"
              >
                {/* Question Row */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-serif text-brand-brown font-semibold text-base sm:text-lg focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-brand-gold flex-shrink-0" />
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-brand-gold flex-shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {/* Answer Row */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[300px] border-t border-brand-sand/50" : "max-h-0"
                  }`}
                >
                  <p className="px-6 py-5 text-gray-500 text-sm sm:text-base leading-relaxed bg-brand-warm-white/30">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support CTA */}
        <div className="mt-14 text-center bg-white p-8 rounded-2xl border border-brand-sand/60">
          <h3 className="font-serif text-xl text-brand-brown font-semibold mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
            Our team is here to help! Get in touch and we will reply within 24 hours.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-white text-sm font-semibold rounded-full transition-all"
          >
            Contact Customer Support
          </a>
        </div>

      </div>
    </div>
  );
}
