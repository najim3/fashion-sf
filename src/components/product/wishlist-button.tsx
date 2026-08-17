"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WishlistButtonProps {
  productHandle: string;
  className?: string;
}

export function WishlistButton({ productHandle, className }: WishlistButtonProps) {
  const { items, toggleItem } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <button 
        className={cn("p-2 bg-background/80 backdrop-blur-sm rounded-full text-muted-foreground cursor-not-allowed opacity-50", className)}
        disabled
      >
        <Heart className="w-4 h-4" />
      </button>
    );
  }

  const inWishlist = items.includes(productHandle);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    toggleItem(productHandle);
    
    if (inWishlist) {
      toast("Removed from wishlist");
    } else {
      toast.success("Added to wishlist", {
        description: "You can view your saved items at any time."
      });
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "p-2 bg-background/80 backdrop-blur-sm rounded-full transition-all hover:bg-background text-foreground group",
        isAnimating && "scale-110",
        className
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={cn(
          "w-4 h-4 transition-colors", 
          inWishlist ? "fill-red-500 text-red-500" : "group-hover:text-red-500"
        )} 
      />
    </button>
  );
}
