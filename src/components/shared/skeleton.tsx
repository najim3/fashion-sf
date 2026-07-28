import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductGallerySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton className="aspect-[3/4] w-full hidden md:block" />
      <Skeleton className="aspect-[3/4] w-full hidden md:block" />
      <Skeleton className="aspect-[3/4] w-full hidden md:block" />
    </div>
  );
}

export function TextBlockSkeleton() {
  return (
    <div className="space-y-3 w-full">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/4 mb-6" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
