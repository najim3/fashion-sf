import { Metadata } from "next";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { generateCollectionJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { getCollectionByHandle, getCollectionProducts } from "@/lib/shopify/queries/collections";
import { getProducts } from "@/lib/shopify/queries/products";
import { mapShopifyProductToProduct } from "@/lib/shopify/mapper";
import { Product } from "@/components/product/product-card";

export const revalidate = 60; // ISR

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "New Arrivals | Fashion SF",
    description: "Explore the latest additions and freshest drops in fashion and modern apparel.",
    openGraph: {
      title: "New Arrivals | Fashion SF",
      description: "Discover our newest collection of trendsetting apparel, outerwear, and accessories.",
    },
  };
}

export default async function NewArrivalsCollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  const sortKeyParam = (resolvedSearchParams.sortKey as string) || "CREATED_AT";
  const reverseParam = resolvedSearchParams.reverse !== "false";
  
  let productsList: any[] = [];
  
  // Try fetching from Shopify 'new-arrivals' collection first
  const collection = await getCollectionByHandle("new-arrivals");
  
  if (collection) {
    const result = await getCollectionProducts({
      handle: "new-arrivals",
      sortKey: sortKeyParam === "CREATED_AT" ? "COLLECTION_DEFAULT" : (sortKeyParam as any),
      reverse: reverseParam,
      first: 24,
    });
    if (result?.products?.length) {
      productsList = result.products;
    }
  }
  
  // Fallback to latest created products if no specific collection exists or has items
  if (!productsList.length) {
    const res = await getProducts({
      sortKey: sortKeyParam,
      reverse: reverseParam,
      first: 24,
    });
    productsList = res.products || [];
  }

  const mappedProducts = productsList.map(mapShopifyProductToProduct).filter(Boolean) as Product[];

  const collectionInfo = collection || {
    id: "new-arrivals-collection",
    handle: "new-arrivals",
    title: "New Arrivals",
    description: "Discover the latest styles, freshest drops, and newest additions to our collection.",
    image: null,
  };

  const collectionJsonLd = generateCollectionJsonLd(collectionInfo);
  
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Categories", url: "/collections" },
    { name: "New Arrivals", url: "/collections/new-arrivals" },
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
            { name: "New Arrivals", url: "/collections/new-arrivals" },
          ]}
        />

        {/* Collection Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-block bg-brand text-brand-foreground text-xs font-bold px-3 py-1 uppercase tracking-widest mb-3">
            Just Dropped
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
            New Arrivals
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base md:text-lg">
            {collectionInfo.description}
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-border">
          <div className="text-sm font-medium text-muted-foreground">
            Showing {mappedProducts.length} new items
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
          </div>
        </div>
      </div>
    </>
  );
}
