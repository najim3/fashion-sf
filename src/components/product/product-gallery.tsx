"use client";

import React, { useState } from "react";
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
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
  };

  const handleMouseLeave = () => {
    // Reset to center when mouse leaves
    setTransformOrigin("50% 50%");
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
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
                "relative flex-shrink-0 w-20 aspect-[3/4] overflow-hidden bg-muted snap-center transition-all",
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
      <div 
        className="relative flex-1 aspect-[3/4] bg-muted overflow-hidden group cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={selectedImage.url}
          alt={selectedImage.altText || "Product main image"}
          fill
          priority
          className="object-cover transition-transform duration-200 ease-out md:group-hover:scale-150"
          style={{ transformOrigin }}
        />
      </div>
    </div>
  );
}
