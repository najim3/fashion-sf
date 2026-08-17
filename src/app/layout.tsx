import type { Metadata, Viewport } from "next";
import { Inter, Outfit, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { cn } from "@/lib/utils";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fashionsf.com"),
  title: {
    default: "Fashion SF | Modern Apparel & Accessories",
    template: "%s | Fashion SF",
  },
  description: "Discover the latest trends in modern fashion apparel, shoes, and accessories. Premium quality for contemporary lifestyles.",
  keywords: ["fashion", "apparel", "clothing", "menswear", "womenswear", "accessories", "modern fashion"],
  authors: [{ name: "Fashion SF" }],
  openGraph: {
    title: "Fashion SF | Modern Apparel & Accessories",
    description: "Discover the latest trends in modern fashion apparel, shoes, and accessories.",
    url: "/",
    siteName: "Fashion SF",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "overflow-x-hidden", inter.variable, outfit.variable, "font-sans", ibmPlexSans.variable)}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen min-h-dvh flex flex-col font-sans bg-background text-foreground selection:bg-brand selection:text-brand-foreground overflow-x-hidden max-w-full"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand focus:text-brand-foreground focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          Skip to content
        </a>
        <Providers>
          <AnnouncementBar />
          <Header />
          <main id="main-content" className="flex-1 w-full overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </Providers>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
