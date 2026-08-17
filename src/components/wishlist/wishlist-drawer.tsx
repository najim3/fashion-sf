"use client";

import { useEffect, useState } from "react";
import { X, Heart, ShoppingBag, Trash2, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Money, useCart } from "@shopify/hydrogen-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlist-store";
import { getProductsByHandles } from "@/lib/actions/wishlist";
import { Product } from "@/components/product/product-card";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const { linesAdd } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fetch product details when drawer is open or items change
  useEffect(() => {
    async function fetchWishlistProducts() {
      if (!items.length) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedProducts = await getProductsByHandles(items);
        const validProducts = (fetchedProducts || []).filter(Boolean) as Product[];
        setProducts(validProducts);

        // Prune any stale handles stored locally that do not exist in Shopify
        const validHandles = new Set(validProducts.map((p) => p.handle));
        items.forEach((handle) => {
          if (!validHandles.has(handle)) {
            removeItem(handle);
          }
        });
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isOpen) {
      fetchWishlistProducts();
    }
  }, [isOpen, items, removeItem]);

  const handleAddToCart = (product: Product) => {
    if (!product.variantId) return;

    setAddingId(product.id);
    linesAdd([{ merchandiseId: product.variantId, quantity: 1 }]);

    setTimeout(() => {
      setAddingId(null);
      toast.success("Added to cart", {
        description: `Successfully added ${product.title} to your cart.`
      });
    }, 400);
  };

  const handleRemove = (handle: string) => {
    removeItem(handle);
    setProducts((prev) => prev.filter((p) => p.handle !== handle));
    toast("Removed from wishlist");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-brand/50 z-[100] transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-background z-[101] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            Your Wishlist ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close wishlist</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-2">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium">Your wishlist is empty</h3>
              <p className="text-muted-foreground max-w-[220px]">
                Explore our collections and save items you love.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-3 bg-brand text-brand-foreground font-medium rounded-md hover:opacity-90 transition-colors"
              >
                Explore Products
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 py-4 border-b border-border last:border-0"
                >
                  <Link
                    href={`/products/${product.handle}`}
                    onClick={onClose}
                    className="relative h-24 w-20 flex-shrink-0 bg-muted rounded overflow-hidden group"
                  >
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      {product.vendor && (
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          {product.vendor}
                        </p>
                      )}
                      <Link
                        href={`/products/${product.handle}`}
                        onClick={onClose}
                        className="font-medium text-foreground hover:underline line-clamp-1 flex items-center gap-1 group"
                      >
                        <span>{product.title}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <div className="mt-1">
                        {typeof product.price === "string" ? (
                          <span className="font-semibold text-sm">{product.price}</span>
                        ) : (
                          <Money data={product.price} className="font-semibold text-sm" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.availableForSale === false || addingId === product.id}
                        className="px-3 py-1.5 bg-brand text-brand-foreground text-xs font-medium rounded hover:opacity-90 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingId === product.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <ShoppingBag className="w-3 h-3" />
                        )}
                        {addingId === product.id ? "Adding..." : "Add to Cart"}
                      </button>

                      <button
                        onClick={() => handleRemove(product.handle)}
                        className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Remove from wishlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 bg-background">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="block w-full py-3 bg-muted text-foreground text-center font-medium rounded-md hover:bg-muted/80 transition-colors"
            >
              View Full Wishlist Page ({items.length})
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
