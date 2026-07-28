"use client";

import { useCart, Money } from "@shopify/hydrogen-react";
import Link from "next/link";
import { Lock } from "lucide-react";

export function CartSummary() {
  const { cost, checkoutUrl, status } = useCart();
  
  if (status === "uninitialized") return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6 flex flex-col gap-4">
      <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-4">
        Order Summary
      </h2>
      
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          {cost?.subtotalAmount ? (
            <Money data={cost.subtotalAmount} className="font-medium text-gray-900" />
          ) : (
            <span>-</span>
          )}
        </div>
        
        {/* Taxes and Shipping are calculated at checkout */}
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">Calculated at checkout</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Taxes</span>
          <span className="text-gray-900">Calculated at checkout</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
        <span className="text-base font-medium text-gray-900">Total</span>
        {cost?.totalAmount ? (
          <Money data={cost.totalAmount} className="text-xl font-semibold text-gray-900" />
        ) : (
          <span>-</span>
        )}
      </div>
      
      {checkoutUrl && (
        <a 
          href={checkoutUrl}
          className="w-full mt-4 flex items-center justify-center gap-2 py-4 px-6 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
        >
          <Lock className="w-4 h-4" />
          Checkout securely
        </a>
      )}
      
      <Link 
        href="/collections" 
        className="w-full text-center py-2 text-sm text-gray-600 hover:text-black underline mt-2"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
