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

export const metadata: Metadata = {
  title: "Fashion SF | Modern Apparel & Accessories",
  description: "Discover the latest trends in fashion at Fashion SF. We provide high-quality apparel for the modern lifestyle.",
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fashion SF",
    url: "https://fashionsf.com",
    logo: "https://fashionsf.com/logo.png",
    description: metadata.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex flex-col min-h-screen">
        <HeroBanner />
        <FeaturedCollections />
        <NewArrivals />
        <BestSellers />
        <TrendingProducts />
        <FlashSale />
        <BrandStory />
        <Testimonials />
        <NewsletterSignup />
      </main>
    </>
  );
}
