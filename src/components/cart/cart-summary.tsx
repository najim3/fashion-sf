"use client";

import { useCart, Money } from "@shopify/hydrogen-react";
import Link from "next/link";
import { Lock } from "lucide-react";

export function CartSummary() {
  const { cost, checkoutUrl, status } = useCart();
  
  if (status === "uninitialized") return null;

  return (
    <div className="bg-muted rounded-lg p-6 flex flex-col gap-4">
      <h2 className="text-lg font-medium text-foreground border-b border-border pb-4">
        Order Summary
      </h2>
      
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          {cost?.subtotalAmount ? (
            <Money data={cost.subtotalAmount} className="font-medium text-foreground" />
          ) : (
            <span>-</span>
          )}
        </div>
        
        {/* Taxes and Shipping are calculated at checkout */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground">Calculated at checkout</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Taxes</span>
          <span className="text-foreground">Calculated at checkout</span>
        </div>
      </div>
      
      <div className="border-t border-border pt-4 flex justify-between items-center">
        <span className="text-base font-medium text-foreground">Total</span>
        {cost?.totalAmount ? (
          <Money data={cost.totalAmount} className="text-xl font-semibold text-foreground" />
        ) : (
          <span>-</span>
        )}
      </div>
      
      {checkoutUrl && (
        <a 
          href={checkoutUrl}
          className="w-full mt-4 flex items-center justify-center gap-2 py-4 px-6 bg-brand text-brand-foreground font-medium rounded-md hover:opacity-90 hover:bg-brand transition-colors"
        >
          <Lock className="w-4 h-4" />
          Checkout securely
        </a>
      )}
      
      <Link 
        href="/collections" 
        className="w-full text-center py-2 text-sm text-muted-foreground hover:text-foreground underline mt-2"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
