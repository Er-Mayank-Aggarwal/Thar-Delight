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
  title: "Thar Delight — Authentic Flavors from the Thar Desert",
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
