import { getProductRecommendations } from "@/lib/shopify/queries/products";
import { mapShopifyProductToProduct } from "@/lib/shopify/mapper";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  productId: string;
}

export async function RelatedProducts({ productId }: RelatedProductsProps) {
  // Extract the numeric ID from the global ID if necessary, or pass directly depending on Shopify API version
  // Actually, getProductRecommendations expects a GraphQL Product ID (gid://...)
  const recommendations = await getProductRecommendations(productId);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Map to UI products and limit to 4 for the design
  const mappedProducts = recommendations.slice(0, 4).map(mapShopifyProductToProduct);

  return (
    <div className="py-12 md:py-16 mt-12 border-t border-gray-100">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center">
        You May Also Like
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {mappedProducts.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
