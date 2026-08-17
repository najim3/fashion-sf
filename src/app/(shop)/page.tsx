import { Metadata } from "next";
import { HeroBanner } from "@/components/home/hero-banner";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { NewArrivals } from "@/components/home/new-arrivals";
import { BestSellers } from "@/components/home/best-sellers";
import { NewsletterSignup } from "@/components/home/newsletter-signup";
import { TrendingProducts } from "@/components/home/trending-products";
import { FlashSale } from "@/components/home/flash-sale";
import { BrandStory } from "@/components/home/brand-story";
import { Testimonials } from "@/components/home/testimonials";
import { getProducts } from "@/lib/shopify/queries/products";
import { getCollections } from "@/lib/shopify/queries/collections";
import { mapShopifyProductToProduct } from "@/lib/shopify/mapper";
import { Product } from "@/components/product/product-card";

export const revalidate = 60; // revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Fashion SF | Modern Apparel & Accessories",
  description: "Discover the latest trends in fashion at Fashion SF. We provide high-quality apparel for the modern lifestyle.",
};

export default async function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fashion SF",
    url: "https://fashionsf.com",
    logo: "https://fashionsf.com/logo.png",
    description: metadata.description,
  };

  // Fetch products and collections for all sections in parallel
  const [newArrivalsRes, bestSellersRes, trendingRes, flashSaleRes, collectionsRes] = await Promise.all([
    getProducts({ sortKey: 'CREATED_AT', reverse: true, first: 8 }),
    getProducts({ sortKey: 'BEST_SELLING', first: 8 }),
    getProducts({ sortKey: 'BEST_SELLING', first: 8 }), // Fallback for trending
    getProducts({ first: 4 }), // Fallback for flash sale
    getCollections({ first: 4 })
  ]);

  const newArrivals = newArrivalsRes.products.map(mapShopifyProductToProduct).filter(Boolean) as Product[];
  const bestSellers = bestSellersRes.products.map(mapShopifyProductToProduct).filter(Boolean) as Product[];
  const trending = trendingRes.products.map(mapShopifyProductToProduct).filter(Boolean) as Product[];
  const flashSale = flashSaleRes.products.map(mapShopifyProductToProduct).filter(Boolean) as Product[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex flex-col min-h-screen">
        <HeroBanner />
        <FeaturedCollections collections={collectionsRes} />
        <NewArrivals products={newArrivals} />
        <BestSellers products={bestSellers} />
        <TrendingProducts products={trending} />
        <FlashSale products={flashSale} />
        <BrandStory />
        <Testimonials />
        <NewsletterSignup />
      </main>
    </>
  );
}
