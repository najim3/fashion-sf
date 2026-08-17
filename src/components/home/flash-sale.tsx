"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard, Product } from "@/components/product/product-card";
import { ArrowRight, Clock } from "lucide-react";

export function FlashSale({ products }: { products: Product[] }) {
  // Countdown logic
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-red-50 border-t border-b border-red-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Limited Time Offer
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Flash Sale</h2>
            <p className="text-muted-foreground max-w-md">Grab these premium styles at up to 50% off. Sale ends soon.</p>
          </div>
          
          <div className="flex flex-col items-center bg-background p-6 rounded-2xl shadow-sm border border-red-100">
            <div className="flex items-center gap-2 mb-3 text-red-600 font-medium">
              <Clock className="w-5 h-5" />
              <span>Offer ends in:</span>
            </div>
            <div className="flex gap-4 text-center">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold font-display w-12 h-12 flex items-center justify-center bg-red-600 text-white rounded-lg shadow-sm">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </span>
                <span className="text-xs uppercase text-muted-foreground mt-2 font-medium tracking-wider">Hours</span>
              </div>
              <span className="text-2xl font-bold text-red-600 self-start mt-2">:</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold font-display w-12 h-12 flex items-center justify-center bg-red-600 text-white rounded-lg shadow-sm">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </span>
                <span className="text-xs uppercase text-muted-foreground mt-2 font-medium tracking-wider">Mins</span>
              </div>
              <span className="text-2xl font-bold text-red-600 self-start mt-2">:</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold font-display w-12 h-12 flex items-center justify-center bg-red-600 text-white rounded-lg shadow-sm">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </span>
                <span className="text-xs uppercase text-muted-foreground mt-2 font-medium tracking-wider">Secs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                SALE
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/collections/sale" 
            className="inline-flex items-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Shop All Sale Items
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
