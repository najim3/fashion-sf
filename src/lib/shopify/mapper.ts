export function mapShopifyProductToProduct(shopifyProduct: any) {
  if (!shopifyProduct) return null;
  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    title: shopifyProduct.title,
    vendor: shopifyProduct.vendor,
    price: shopifyProduct.priceRange?.minVariantPrice || shopifyProduct.variants?.nodes?.[0]?.price,
    compareAtPrice: shopifyProduct.variants?.nodes?.[0]?.compareAtPrice,
    image: shopifyProduct.images?.nodes?.[0]?.url || shopifyProduct.featuredImage?.url || '',
    secondaryImage: shopifyProduct.images?.nodes?.[1]?.url || '',
    isNew: shopifyProduct.tags?.includes('new'),
  };
}
