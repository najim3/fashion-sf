import { ProductGridSkeleton } from "@/components/shared/skeleton";

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Shop All</h1>
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-md" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="hidden md:block w-64 flex-shrink-0 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
        
        <div className="flex-1">
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    </div>
  );
}
