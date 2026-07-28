"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Money } from "@shopify/hydrogen-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { WishlistButton } from "./wishlist-button";

export interface Product {
  id: string;
  handle: string;
  title: string;
  vendor?: string;
  price: string | { amount: string; currencyCode: any };
  compareAtPrice?: string | { amount: string; currencyCode: any };
  image: string;
  secondaryImage?: string;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const displayImage = isHovered && product.secondaryImage ? product.secondaryImage : product.image;

  return (
    <div 
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-gray-100 aspect-[3/4] overflow-hidden mb-4">
        <Link href={`/products/${product.handle}`} className="block w-full h-full">
          <Image
            src={displayImage}
            alt={product.title}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              isHovered ? "scale-105" : "scale-100"
            )}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-black text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
              New
            </span>
          )}
          {product.compareAtPrice && (
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <WishlistButton productHandle={product.handle} />
        </div>

        {/* Quick Add Button */}
        <button className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur text-black py-3 px-4 flex items-center justify-center gap-2 font-medium opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-black hover:text-white">
          <ShoppingBag className="w-4 h-4" />
          Quick Add
        </button>
      </div>
      
      {/* Product Details */}
      <div className="flex flex-col">
        {product.vendor && (
          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.vendor}</span>
        )}
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-medium text-gray-900 hover:underline line-clamp-1">{product.title}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          {typeof product.price === 'string' ? (
            <span className="font-semibold">{product.price}</span>
          ) : (
            <Money data={product.price} className="font-semibold" />
          )}
          
          {product.compareAtPrice && (
            typeof product.compareAtPrice === 'string' ? (
              <span className="text-gray-500 line-through text-sm">{product.compareAtPrice}</span>
            ) : (
              <Money data={product.compareAtPrice} className="text-gray-500 line-through text-sm" />
            )
          )}
        </div>
      </div>
    </div>
  );
}
