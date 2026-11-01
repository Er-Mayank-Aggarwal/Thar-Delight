import { Inter, Lora, Dancing_Script } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import LayoutShell from "./components/LayoutShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL || "https://thardelight.com"),
  title: {
    default: "Thar Delight — Authentic Flavors from the Thar Desert",
    template: "%s — Thar Delight",
  },
  description:
    "Discover wholesome millet cookies, traditional farali treats, and handcrafted wooden serveware from the heart of Rajasthan. 100% natural, no preservatives.",
  keywords: [
    "millet cookies",
    "farali cookies",
    "Rajasthan snacks",
    "wooden craft",
    "Thar desert",
    "organic snacks",
    "handcrafted",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Thar Delight",
    title: "Thar Delight — Authentic Flavors from the Thar Desert",
    description:
      "Wholesome millet cookies, farali treats & handcrafted wooden serveware from Rajasthan. 100% natural, no preservatives.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thar Delight — Authentic Flavors from the Thar Desert",
    description:
      "Wholesome millet cookies, farali treats & handcrafted wooden serveware from Rajasthan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextTopLoader color="#d4af37" showSpinner={false} />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
