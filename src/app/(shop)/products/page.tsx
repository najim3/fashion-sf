import { Metadata } from "next";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { Pagination } from "@/components/product/pagination";
import { getProducts } from "@/lib/shopify/queries/products";
import { mapShopifyProductToProduct } from "@/lib/shopify/mapper";

export const metadata: Metadata = {
  title: "Shop All Products | Fashion SF",
  description: "Browse our complete collection of fashion and accessories.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const sortKey = (resolvedParams.sortKey as string) || "CREATED_AT";
  const reverse = resolvedParams.reverse === "true";
  const after = (resolvedParams.after as string) || undefined;
  
  // Note: Implementing full complex Shopify filtering requires Storefront API configuration.
  // For now we pass basic params.
  
  const { products, pageInfo } = await getProducts({
    sortKey,
    reverse,
    after,
    first: 12,
  });

  const mappedProducts = products.map(mapShopifyProductToProduct);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Shop All</h1>
          <p className="text-gray-600">Discover our latest collection of premium fashion.</p>
        </div>
        <div className="flex items-center gap-4">
          <ProductSort />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 flex-shrink-0">
          <ProductFilters />
        </div>
        
        <div className="flex-1 min-w-0">
          <ProductGrid products={mappedProducts} />
          <Pagination pageInfo={pageInfo} />
        </div>
      </div>
    </div>
  );
}
