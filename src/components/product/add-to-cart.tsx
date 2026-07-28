"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@shopify/hydrogen-react";
import { toast } from "sonner";

interface AddToCartProps {
  variantId?: string;
  availableForSale: boolean;
}

export function AddToCart({ variantId, availableForSale }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { linesAdd } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!variantId) return;
    
    setIsAdding(true);
    // Add to Shopify Hydrogen cart
    linesAdd([{ merchandiseId: variantId, quantity }]);
    
    // Simulate slight delay for UX
    setTimeout(() => {
      setIsAdding(false);
      toast.success("Added to cart", {
        description: `Successfully added ${quantity} item(s) to your cart.`
      });
      window.dispatchEvent(new CustomEvent('open-cart'));
    }, 500);
  };

  const handleBuyNow = () => {
    if (!variantId) return;
    
    // For "Buy Now", typically we create a separate checkout just for this item
    // or just add to cart and redirect to checkout.
    // For now we'll just add to cart and alert.
    linesAdd([{ merchandiseId: variantId, quantity }]);
    alert("Redirecting to checkout...");
  };

  return (
    <div className="space-y-6">
      {/* Quantity & Stock Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button 
            type="button"
            onClick={decreaseQuantity}
            className="p-3 text-gray-500 hover:text-black transition-colors"
            disabled={quantity <= 1 || !availableForSale}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button 
            type="button"
            onClick={increaseQuantity}
            className="p-3 text-gray-500 hover:text-black transition-colors"
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
          className="w-full py-4 bg-black text-white rounded-md font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
        
        <button
          onClick={handleBuyNow}
          disabled={!availableForSale || !variantId}
          className="w-full py-4 bg-gray-100 text-black rounded-md font-medium hover:bg-gray-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Buy it now
        </button>
      </div>
      
    </div>
  );
}
