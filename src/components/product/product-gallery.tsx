"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: {
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  }[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[800px] snap-x scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={cn(
                "relative flex-shrink-0 w-20 aspect-[3/4] overflow-hidden bg-gray-100 snap-center transition-all",
                selectedImage.url === image.url 
                  ? "ring-2 ring-black" 
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={image.url}
                alt={image.altText || `Product thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative flex-1 aspect-[3/4] bg-gray-100 overflow-hidden group">
        <Image
          src={selectedImage.url}
          alt={selectedImage.altText || "Product main image"}
          fill
          priority
          className="object-cover transition-transform duration-500 ease-out md:group-hover:scale-110 cursor-zoom-in"
        />
      </div>
    </div>
  );
}
