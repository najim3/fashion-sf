import { Metadata } from "next";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Pagination } from "@/components/product/pagination";
import { generateCollectionJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { getCollectionByHandle, getCollectionProducts } from "@/lib/shopify/queries/collections";
import { getProducts } from "@/lib/shopify/queries/products";
import { mapShopifyProductToProduct } from "@/lib/shopify/mapper";
import { Product } from "@/components/product/product-card";

export const revalidate = 60; // ISR

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "All Products | Fashion SF",
    description: "Browse our complete catalog of modern fashion apparel, shoes, outerwear, and accessories.",
    openGraph: {
      title: "All Products | Fashion SF",
      description: "Explore the full collection of trendsetting fashion items at Fashion SF.",
    },
  };
}

export default async function AllProductsCollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  const sortKeyParam = (resolvedSearchParams.sortKey as string) || "BEST_SELLING";
  const reverseParam = resolvedSearchParams.reverse === "true";
  const afterParam = (resolvedSearchParams.after as string) || undefined;
  
  let productsList: any[] = [];
  let pageInfo = { hasNextPage: false, hasPreviousPage: false, startCursor: undefined, endCursor: undefined };
  
  // Try fetching from Shopify 'all' collection first
  const collection = await getCollectionByHandle("all");
  
  if (collection) {
    const result = await getCollectionProducts({
      handle: "all",
      sortKey: sortKeyParam as any,
      reverse: reverseParam,
      after: afterParam,
      first: 24,
    });
    if (result?.products?.length) {
      productsList = result.products;
      if (result.pageInfo) {
        pageInfo = result.pageInfo as any;
      }
    }
  }
  
  // Fallback to fetching all products if no 'all' collection exists in Shopify
  if (!productsList.length) {
    const res = await getProducts({
      sortKey: sortKeyParam,
      reverse: reverseParam,
      after: afterParam,
      first: 24,
    });
    productsList = res.products || [];
    if (res.pageInfo) {
      pageInfo = res.pageInfo as any;
    }
  }

  const mappedProducts = productsList.map(mapShopifyProductToProduct).filter(Boolean) as Product[];

  const collectionInfo = collection || {
    id: "all-products-collection",
    handle: "all",
    title: "All Products",
    description: "Browse our complete catalog of modern fashion apparel, footwear, and accessories.",
    image: null,
  };

  const collectionJsonLd = generateCollectionJsonLd(collectionInfo);
  
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Categories", url: "/collections" },
    { name: "All Products", url: "/collections/all" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <Breadcrumbs
          items={[
            { name: "Categories", url: "/collections" },
            { name: "All Products", url: "/collections/all" },
          ]}
        />

        {/* Collection Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-block bg-brand text-brand-foreground text-xs font-bold px-3 py-1 uppercase tracking-widest mb-3">
            Full Catalog
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
            All Products
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base md:text-lg">
            {collectionInfo.description}
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-border">
          <div className="text-sm font-medium text-muted-foreground">
            Showing {mappedProducts.length} products
          </div>
          <div className="flex items-center gap-4">
            <ProductSort />
          </div>
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <ProductFilters />
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={mappedProducts} />
            <Pagination pageInfo={pageInfo} />
          </div>
        </div>
      </div>
    </>
  );
}
