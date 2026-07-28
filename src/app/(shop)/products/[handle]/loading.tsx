import { ProductGallerySkeleton, TextBlockSkeleton } from "@/components/shared/skeleton";

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Gallery Skeleton */}
        <div className="md:w-1/2 lg:w-3/5">
          <ProductGallerySkeleton />
        </div>
        
        {/* Details Skeleton */}
        <div className="md:w-1/2 lg:w-2/5 flex flex-col gap-6">
          <TextBlockSkeleton />
          
          <div className="space-y-4 py-6 border-y border-gray-100">
            <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-10 bg-gray-200 animate-pulse rounded-full" />
              ))}
            </div>
            
            <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded mt-6" />
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-14 bg-gray-200 animate-pulse rounded-md" />
              ))}
            </div>
          </div>
          
          <div className="space-y-3 mt-4">
            <div className="h-12 w-full bg-gray-200 animate-pulse rounded-md" />
            <div className="h-12 w-full bg-gray-200 animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
