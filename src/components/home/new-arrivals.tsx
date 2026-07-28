"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { ProductCard, Product } from "@/components/product/product-card";

const MOCK_NEW_ARRIVALS: Product[] = [
  { id: "1", handle: "cotton-t-shirt", title: "Premium Cotton T-Shirt", price: "$35.00", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop", isNew: true },
  { id: "2", handle: "denim-jacket", title: "Classic Denim Jacket", price: "$120.00", image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1374&auto=format&fit=crop", isNew: true },
  { id: "3", handle: "silk-blouse", title: "Silk Blouse", price: "$85.00", image: "https://images.unsplash.com/photo-1551728259-2b0e9d6d37aa?q=80&w=1527&auto=format&fit=crop", isNew: true },
  { id: "4", handle: "leather-sneakers", title: "Minimalist Leather Sneakers", price: "$95.00", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1412&auto=format&fit=crop", isNew: true },
  { id: "5", handle: "linen-trousers", title: "Relaxed Linen Trousers", price: "$75.00", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1480&auto=format&fit=crop", isNew: true },
  { id: "6", handle: "wool-coat", title: "Oversized Wool Coat", price: "$240.00", image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1374&auto=format&fit=crop", isNew: true },
];

export function NewArrivals() {
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
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">New Arrivals</h2>
            <p className="text-gray-600">The latest additions to our collection.</p>
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
            {MOCK_NEW_ARRIVALS.map((product) => (
              <div 
                key={product.id} 
                className="embla__slide pl-4 flex-[0_0_80%] sm:flex-[0_0_40%] md:flex-[0_0_30%] lg:flex-[0_0_22%]"
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
