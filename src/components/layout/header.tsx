"use client";

import Link from "next/link";
import { Search, Heart, User, ShoppingBag, Menu } from "lucide-react";
import { useCart } from "@shopify/hydrogen-react";
import { useState, useEffect } from "react";
import { MegaMenu } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WishlistDrawer } from "@/components/wishlist/wishlist-drawer";
import { SearchOverlay } from "@/components/search/search-overlay";
import { useWishlistStore } from "@/stores/wishlist-store";

export function Header() {
  const { totalQuantity } = useCart();
  const wishlistItems = useWishlistStore((state) => state.items);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="p-2 -ml-2 text-foreground"
          >
            <Menu className="w-5 h-5" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>

        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            href="/"
            className="font-display font-bold text-2xl tracking-tighter"
          >
            FASHION SF
          </Link>
          <div className="hidden md:block">
            <MegaMenu />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-muted rounded-full transition-colors text-foreground"
          >
            <Search className="w-5 h-5" />
            <span className="sr-only">Search</span>
          </button>

          <button
            onClick={() => setIsWishlistOpen(true)}
            className="p-2 hover:bg-muted rounded-full transition-colors relative text-foreground"
          >
            <Heart className="w-5 h-5" />
            {isMounted && wishlistItems.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-brand text-brand-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                {wishlistItems.length}
              </span>
            )}
            <span className="sr-only">Wishlist</span>
          </button>

          <Link
            href="/account"
            className="p-2 hover:bg-muted rounded-full transition-colors hidden sm:block text-foreground"
          >
            <User className="w-5 h-5" />
            <span className="sr-only">Account</span>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 hover:bg-muted rounded-full transition-colors relative text-foreground"
          >
            <ShoppingBag className="w-5 h-5" />
            {isMounted && (totalQuantity ?? 0) > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-brand text-brand-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                {totalQuantity}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </button>
        </div>
      </div>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
