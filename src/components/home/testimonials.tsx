"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const MOCK_TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    rating: 5,
    text: "The quality of these pieces is absolutely unmatched. I've completely overhauled my wardrobe with Fashion SF and I get compliments everywhere I go.",
    product: "Cashmere Turtleneck",
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    text: "Fast shipping and incredible customer service. The leather jacket I ordered fits perfectly and you can feel the attention to detail.",
    product: "Classic Leather Biker Jacket",
  },
  {
    id: 3,
    name: "Emma Watson",
    rating: 4,
    text: "I love the sustainable focus of this brand. The clothes are not only beautiful but I feel good about wearing them.",
    product: "Wide-Leg Corduroy Pants",
  },
  {
    id: 4,
    name: "David Miller",
    rating: 5,
    text: "Minimalist design at its best. Everything mixes and matches so easily. I'm definitely a customer for life.",
    product: "Premium Cotton T-Shirt",
  },
];

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on("select", onSelect);
    
    // Auto-scroll logic
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoplay);
    };
  }, [emblaApi]);

  return (
    <section className="py-24 bg-muted border-t border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold mb-4">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-semibold text-lg">4.9/5</span>
          </div>
          <p className="text-muted-foreground">Based on over 1,000+ reviews</p>
        </div>

        <div className="embla max-w-4xl mx-auto" ref={emblaRef}>
          <div className="embla__container flex">
            {MOCK_TESTIMONIALS.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="embla__slide flex-[0_0_100%] md:flex-[0_0_80%] px-4"
              >
                <div className="bg-background p-8 md:p-10 rounded-2xl shadow-sm border border-border text-center h-full flex flex-col items-center justify-center">
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground mb-8 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">Purchased: {testimonial.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {MOCK_TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                idx === selectedIndex ? "bg-brand" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
