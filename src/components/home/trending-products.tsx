"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { ProductCard, Product } from "@/components/product/product-card";

export function TrendingProducts({ products }: { products: Product[] }) {
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
    <section className="py-20 bg-background overflow-hidden border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">Trending Now</h2>
            <p className="text-muted-foreground">What everyone is talking about this week.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={scrollPrev}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-foreground hover:bg-brand hover:text-white transition-colors"
              aria-label="Previous items"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-foreground hover:bg-brand hover:text-white transition-colors"
              aria-label="Next items"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex -ml-4">
            {products.map((product) => (
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
