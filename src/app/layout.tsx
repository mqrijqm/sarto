import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/cart/Cart";
import { Splash } from "@/components/Splash";
import { LangProvider, type Lang } from "@/lib/i18n";
import { cookies } from "next/headers";
import "./globals.css";

// Self-hosted (Google Fonts, OFL licenca) — bez zavisnosti od mreže pri buildu
// Marcellus = kapitale sa "flared" serifima (zamena za Louize Display)
const marcellus = localFont({ src: "./fonts/Marcellus.woff2", variable: "--font-marcellus", weight: "400", display: "swap" });
// Cormorant italic = kurzivne reči u naslovima (variable font 300–700)
const cormorant = localFont({
  src: [
    { path: "./fonts/Cormorant.woff2", style: "normal", weight: "300 700" },
    { path: "./fonts/Cormorant-Italic.woff2", style: "italic", weight: "300 700" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});
// DM Sans = zamena za Beausite Classic (variable font)
const dmsans = localFont({ src: "./fonts/DMSans.woff2", variable: "--font-dmsans", weight: "100 1000", display: "swap" });

export const metadata: Metadata = {
  title: { default: "SARTO — Custom Sculpture of your Wedding Suit", template: "%s | SARTO" },
  description:
    "SARTO is a luxury fine-art studio that transforms your wedding suit into a timeless, museum-quality plaster sculpture.",
};

export const viewport: Viewport = { themeColor: "#f3f0ed" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // jezik: bosanski podrazumevano, engleski ako je korisnik izabrao (kolačić)
  const lang: Lang = (await cookies()).get("lang")?.value === "en" ? "en" : "bs";
  return (
    <html lang={lang} className={`${marcellus.variable} ${cormorant.variable} ${dmsans.variable}`}>
      <body>
        <LangProvider initial={lang}>
        <SmoothScroll>
          <CartProvider>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:p-3">
              {lang === "bs" ? "Preskoči na sadržaj" : "Skip to content"}
            </a>
            <Splash />
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
          </CartProvider>
        </SmoothScroll>
        </LangProvider>
      </body>
    </html>
  );
}
