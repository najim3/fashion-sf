"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@shopify/hydrogen-react";
import { toast } from "sonner";

interface AddToCartProps {
  variantId?: string;
  availableForSale?: boolean;
}

export function AddToCart({ variantId, availableForSale = true }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const { linesAdd, checkoutUrl } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!variantId) {
      toast.error("Please select an option before adding to cart.");
      return;
    }
    
    setIsAdding(true);
    // Add to Shopify Hydrogen cart
    linesAdd([{ merchandiseId: variantId, quantity }]);
    
    setTimeout(() => {
      setIsAdding(false);
      toast.success("Added to cart", {
        description: `Successfully added ${quantity} item(s) to your cart.`
      });
    }, 400);
  };

  const handleBuyNow = () => {
    if (!variantId) {
      toast.error("Please select an option first.");
      return;
    }
    
    linesAdd([{ merchandiseId: variantId, quantity }]);
    
    setTimeout(() => {
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else if (typeof window !== "undefined") {
        window.location.href = "/cart";
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Quantity & Stock Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-border rounded-md">
          <button 
            type="button"
            onClick={decreaseQuantity}
            className="p-3 text-muted-foreground hover:text-foreground transition-colors"
            disabled={quantity <= 1 || !availableForSale}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button 
            type="button"
            onClick={increaseQuantity}
            className="p-3 text-muted-foreground hover:text-foreground transition-colors"
            disabled={!availableForSale}
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <span className={cn(
          "text-sm font-medium",
          availableForSale ? "text-green-600" : "text-red-600"
        )}>
          {availableForSale ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!availableForSale || !variantId || isAdding}
          className="w-full py-4 bg-brand text-brand-foreground rounded-md font-medium hover:opacity-90 hover:bg-brand transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
        
        <button
          onClick={handleBuyNow}
          disabled={!availableForSale || !variantId}
          className="w-full py-4 bg-muted text-foreground rounded-md font-medium hover:bg-muted transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          Buy it now
        </button>
      </div>
      
    </div>
  );
}
