import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import JsonLd from "@/components/JsonLd";
import { CartProvider } from "@/lib/cart";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · research-use-only peptides`, template: `%s · ${site.shortName}` },
  description: site.tagline,
  robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: site.name, url: site.url },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#0b0d10", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} style={{ ["--font-geist" as string]: GeistSans.style.fontFamily, ["--font-geist-mono" as string]: GeistMono.style.fontFamily }}>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "OnlineStore",
            name: site.name,
            url: site.url,
            email: site.email,
            areaServed: "US",
            creator: { "@type": "Organization", name: site.builder.name, url: site.builder.url },
          }}
        />
        <CartProvider>
          <AgeGate />
          <Header />
          <main className="mx-auto min-h-[60dvh] max-w-7xl px-4 py-10 sm:px-6">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
