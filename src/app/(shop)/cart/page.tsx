"use client";

import { useCart } from "@shopify/hydrogen-react";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";

export default function CartPage() {
  const { lines, status } = useCart();
  
  const isEmpty = !lines || lines.length === 0;

  if (status === "uninitialized" || status === "fetching") {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Browse our collections to find something you'll love.
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
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-10 text-center md:text-left flex items-center justify-center md:justify-start gap-3">
        <ShoppingBag className="w-8 h-8" />
        Your Cart
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="border-t border-gray-200">
            {lines?.map((line: any) => (
              <CartItem key={line.id} line={line} />
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="sticky top-24">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
