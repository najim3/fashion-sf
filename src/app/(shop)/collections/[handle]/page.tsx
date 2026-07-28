import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { generateCollectionJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { Pagination } from "@/components/product/pagination";
import { getCollectionByHandle, getCollectionProducts } from "@/lib/shopify/queries/collections";
import { mapShopifyProductToProduct } from "@/lib/shopify/mapper";

export const revalidate = 60; // ISR

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const collection = await getCollectionByHandle(resolvedParams.handle);

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  return {
    title: `${collection.seo?.title || collection.title} | Fashion SF`,
    description: collection.seo?.description || collection.description,
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const collection = await getCollectionByHandle(resolvedParams.handle);

  if (!collection) {
    notFound();
  }

  const sortKey = (resolvedSearchParams.sortKey as string) || "CREATED_AT";
  const reverse = resolvedSearchParams.reverse === "true";
  const after = (resolvedSearchParams.after as string) || undefined;
  
  const result = await getCollectionProducts({
    handle: resolvedParams.handle,
    sortKey,
    reverse,
    after,
    first: 12,
  });

  if (!result) {
    notFound();
  }

  const { products, pageInfo } = result;
  const mappedProducts = products.map(mapShopifyProductToProduct);

  const collectionJsonLd = generateCollectionJsonLd(collection);
  
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Collections", url: "/collections" },
    { name: collection.title, url: `/collections/${collection.handle}` },
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
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{collection.title}</h1>
        {collection.description && (
          <p className="text-gray-600 max-w-2xl">{collection.description}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="text-sm text-gray-500">
          Showing {mappedProducts.length} products
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
    </>
  );
}
