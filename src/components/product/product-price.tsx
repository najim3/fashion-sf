"use client";

import { Money } from "@shopify/hydrogen-react";

export function ProductPrice({ price, compareAtPrice }: { price: any; compareAtPrice?: any }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {price ? (
        <Money data={price} className="text-2xl font-semibold" />
      ) : null}
      
      {compareAtPrice && (
        <Money data={compareAtPrice} className="text-lg text-muted-foreground line-through" />
      )}
      
      {compareAtPrice && price && 
       parseFloat(compareAtPrice.amount) > parseFloat(price.amount) && (
        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
          Sale
        </span>
      )}
    </div>
  );
}
