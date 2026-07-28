"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist-store";
import { getProductsByHandles } from "@/lib/actions/wishlist";
import { ProductCard } from "@/components/product/product-card";

export default function WishlistPage() {
  const { items, isMounted } = useWishlistStore((state) => ({
    items: state.items,
    isMounted: true // In a real app we'd need to properly handle hydration mismatch, but for this demo we'll use a simple state check below
  }));
  
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    async function fetchWishlist() {
      if (!items.length) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await getProductsByHandles(items);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (hydrated) {
      fetchWishlist();
    }
  }, [items, hydrated]);

  if (!hydrated) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
          <Heart className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-4">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Save items you love to your wishlist and review them later.
        </p>
        <Link
          href="/collections"
          className="px-8 py-4 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          Your Wishlist
        </h1>
        <p className="text-gray-600">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 md:gap-y-12 lg:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
