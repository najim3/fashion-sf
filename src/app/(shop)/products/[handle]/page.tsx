import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPrice } from "@/components/product/product-price";
import { getProductByHandle } from "@/lib/shopify/queries/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { VariantSelector } from "@/components/product/variant-selector";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductDetailsTabs } from "@/components/product/product-details-tabs";
import { RelatedProducts } from "@/components/product/related-products";
import { WishlistButton } from "@/components/product/wishlist-button";
import { generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 60; // ISR

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductByHandle(resolvedParams.handle);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const imageUrl = product.images?.edges?.[0]?.node?.url;

  return {
    title: `${product.seo?.title || product.title} | Fashion SF`,
    description: product.seo?.description || product.description,
    openGraph: {
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const product = await getProductByHandle(resolvedParams.handle);

  if (!product) {
    notFound();
  }

  // Find the selected variant based on URL search params
  const variants = product.variants?.edges?.map((e: any) => e.node) || [];
  
  // Create a default fallback variant if none explicitly matched
  let selectedVariant = variants[0];
  
  if (Object.keys(resolvedSearchParams).length > 0) {
    const matchedVariant = variants.find((variant: any) => {
      // Check if every param matches the variant's selected options
      return variant.selectedOptions.every(
        (option: any) => {
          const paramValue = resolvedSearchParams[option.name.toLowerCase()];
          // If param is not in URL, we consider it a match (or we could strictly require all params)
          // For now, strict match if the param exists
          return !paramValue || paramValue === option.value;
        }
      );
    });
    if (matchedVariant) {
      selectedVariant = matchedVariant;
    }
  }

  const images = product.images?.edges?.map((e: any) => e.node) || [];
  const options = product.options || [];

  // Determine which price to show (variant price or product min price)
  const displayPrice = selectedVariant?.price || product.priceRange?.minVariantPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const availableForSale = selectedVariant?.availableForSale ?? product.availableForSale;

  // Generate JSON-LD Structured Data
  const productJsonLd = generateProductJsonLd({
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    image: images[0]?.url,
    secondaryImage: images[1]?.url,
    price: displayPrice,
    compareAtPrice: compareAtPrice,
    availableForSale: availableForSale,
    vendor: product.vendor,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: product.title, url: `/products/${product.handle}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left Column: Gallery */}
          <div className="md:w-1/2 lg:w-3/5">
            <ProductGallery images={images} />
          </div>
          
          {/* Right Column: Details & Add to Cart */}
          <div className="md:w-1/2 lg:w-2/5 flex flex-col">
            {/* Breadcrumb could go here */}
            
            {product.vendor && (
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                {product.vendor}
              </span>
            )}
            
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                {product.title}
              </h1>
              <WishlistButton 
                productHandle={product.handle} 
                className="bg-gray-100 hover:bg-gray-200" 
              />
            </div>
            
            <ProductPrice price={displayPrice} compareAtPrice={compareAtPrice} />
            
            <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
              <p>{product.description}</p>
            </div>
            
            <div className="w-full h-px bg-gray-200 mb-8" />
            
            <VariantSelector 
              options={options} 
              variants={variants} 
            />
            
            <div className="mt-8 mb-12">
              <AddToCart 
                variantId={selectedVariant?.id} 
                availableForSale={availableForSale} 
              />
            </div>
            
            <ProductDetailsTabs descriptionHtml={product.descriptionHtml} />
          </div>
        </div>
        
        {/* Related Products */}
        <RelatedProducts productId={product.id} />
      </div>
    </>
  );
}
