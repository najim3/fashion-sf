"use client";

import { useEffect } from "react";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@shopify/hydrogen-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { lines, status } = useCart();

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

  const isEmpty = !lines || lines.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close cart</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {status === "uninitialized" || status === "fetching" ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-gray-500 max-w-[200px]">
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {lines?.map((line: any) => (
                <CartItem key={line.id} line={line} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && status !== "uninitialized" && (
          <div className="border-t border-gray-100 p-6 bg-white">
            <CartSummary />
            <Link
              href="/cart"
              onClick={onClose}
              className="block text-center mt-4 text-sm text-gray-500 hover:text-black underline"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
