"use server";

import { predictiveSearch } from "@/lib/shopify/queries/search";
import { mapShopifyProductToProduct } from "@/lib/shopify/mapper";

export async function getPredictiveSearchResults(query: string) {
  if (!query) {
    return { queries: [], products: [], collections: [] };
  }

  try {
    const results = await predictiveSearch({ query });
    
    // Process and map results for the UI
    const mappedProducts = (results.products || []).map(mapShopifyProductToProduct);
    
    return {
      queries: results.queries || [],
      products: mappedProducts,
      collections: results.collections || [],
    };
  } catch (error) {
    console.error("Predictive search failed:", error);
    return { queries: [], products: [], collections: [] };
  }
}
