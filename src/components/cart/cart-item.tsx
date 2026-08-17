"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, Money } from "@shopify/hydrogen-react";
import { cn } from "@/lib/utils";

interface CartItemProps {
  line: any; // Hydrogen CartLine type
}

export function CartItem({ line }: CartItemProps) {
  const { linesUpdate, linesRemove } = useCart();
  const merchandise = line.merchandise;
  const product = merchandise.product;

  if (!merchandise || !product) return null;

  const handleUpdateQuantity = (quantity: number) => {
    if (quantity === 0) {
      linesRemove([line.id]);
    } else {
      linesUpdate([{ id: line.id, merchandiseId: merchandise.id, quantity }]);
    }
  };

  return (
    <div className="flex gap-4 py-6 border-b border-border last:border-0">
      <Link href={`/products/${product.handle}`} className="relative h-24 w-20 md:h-32 md:w-24 flex-shrink-0 bg-muted">
        {merchandise.image && (
          <Image
            src={merchandise.image.url}
            alt={merchandise.image.altText || product.title}
            fill
            className="object-cover"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-2">
          <div>
            {product.vendor && (
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.vendor}</p>
            )}
            <Link href={`/products/${product.handle}`}>
              <h3 className="font-medium text-foreground line-clamp-2 hover:underline">
                {product.title}
              </h3>
            </Link>
            
            {merchandise.selectedOptions.map((option: any) => (
              <p key={option.name} className="text-sm text-muted-foreground mt-1">
                {option.name}: {option.value}
              </p>
            ))}
          </div>
          <div className="text-right">
            <Money data={line.cost.totalAmount} className="font-medium" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-border rounded-md">
            <button
              onClick={() => handleUpdateQuantity(line.quantity - 1)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{line.quantity}</span>
            <button
              onClick={() => handleUpdateQuantity(line.quantity + 1)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          <button
            onClick={() => linesRemove([line.id])}
            className="text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Remove item</span>
          </button>
        </div>
      </div>
    </div>
  );
}
