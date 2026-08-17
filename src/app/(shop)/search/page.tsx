import { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { Pagination } from "@/components/product/pagination";
import { getProducts } from "@/lib/shopify/queries/products";
import { mapShopifyProductToProduct } from "@/lib/shopify/mapper";

export const metadata: Metadata = {
  title: "Search Results | Fashion SF",
  description: "Search for products and collections.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = (resolvedParams.q as string) || "";
  const sortKey = (resolvedParams.sortKey as string) || "RELEVANCE";
  const reverse = resolvedParams.reverse === "true";
  const after = (resolvedParams.after as string) || undefined;
  
  if (!query) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-display font-bold mb-4">Search</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Please enter a search term to find products.
        </p>
        <Link 
          href="/collections" 
          className="px-6 py-3 bg-brand text-brand-foreground rounded-md font-medium hover:opacity-90 hover:bg-brand transition-colors"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  // Use the getProducts query, which maps `query` to Shopify's query string
  const { products, pageInfo } = await getProducts({
    query,
    sortKey,
    reverse,
    after,
    first: 12,
  });

  const mappedProducts = products.map(mapShopifyProductToProduct);
  const hasResults = mappedProducts.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Search Results</p>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
          "{query}"
        </h1>
        {hasResults && (
          <p className="text-muted-foreground">
            Showing {mappedProducts.length} results
          </p>
        )}
      </div>

      {!hasResults ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-8">
            We couldn't find anything matching your search.
          </p>
          <div className="max-w-md mx-auto bg-muted p-6 rounded-lg text-left">
            <h3 className="font-medium mb-2">Search Tips:</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Check your spelling for typos.</li>
              <li>Try using more general terms.</li>
              <li>Try using different keywords.</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div className="hidden md:block" />
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
        </>
      )}
    </div>
  );
}
