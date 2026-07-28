"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { ProductCard, Product } from "@/components/product/product-card";

const MOCK_TRENDING_PRODUCTS: Product[] = [
  { id: "t1", handle: "knit-cardigan", title: "Chunky Knit Cardigan", price: "$150.00", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1372&auto=format&fit=crop" },
  { id: "t2", handle: "maxi-dress", title: "Floral Maxi Dress", price: "$195.00", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1446&auto=format&fit=crop" },
  { id: "t3", handle: "corduroy-pants", title: "Wide-Leg Corduroy Pants", price: "$110.00", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1374&auto=format&fit=crop" },
  { id: "t4", handle: "leather-biker", title: "Classic Leather Biker Jacket", price: "$320.00", image: "https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=1374&auto=format&fit=crop" },
  { id: "t5", handle: "mock-neck-sweater", title: "Ribbed Mock Neck Sweater", price: "$85.00", image: "https://images.unsplash.com/photo-1624378439575-d1ead6bb2d2d?q=80&w=1374&auto=format&fit=crop" },
];

export function TrendingProducts() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-20 bg-white overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">Trending Now</h2>
            <p className="text-gray-600">What everyone is talking about this week.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={scrollPrev}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-colors"
              aria-label="Previous items"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-colors"
              aria-label="Next items"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex -ml-4">
            {MOCK_TRENDING_PRODUCTS.map((product) => (
              <div 
                key={product.id} 
                className="embla__slide pl-4 flex-[0_0_80%] sm:flex-[0_0_40%] md:flex-[0_0_30%] lg:flex-[0_0_25%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
