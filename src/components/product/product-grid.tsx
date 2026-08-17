import { ProductCard, Product } from "./product-card";
import { ProductGridSkeleton } from "@/components/shared/skeleton";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={products.length || 8} />;
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
