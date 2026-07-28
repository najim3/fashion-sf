import { ProductGridSkeleton } from "@/components/shared/skeleton";

export default function CollectionLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col items-center justify-center mb-12">
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-md mb-4" />
        <div className="h-4 w-96 bg-gray-200 animate-pulse rounded-md" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="hidden md:block w-64 flex-shrink-0 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
        
        <div className="flex-1">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}
