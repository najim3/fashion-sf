"use server";

import { getProductByHandle } from "@/lib/shopify/queries/products";
import { mapShopifyProductToProduct } from "@/lib/shopify/mapper";

export async function getProductsByHandles(handles: string[]) {
  if (!handles || handles.length === 0) {
    return [];
  }

  try {
    const promises = handles.map(async (handle) => {
      const product = await getProductByHandle(handle);
      return product ? mapShopifyProductToProduct(product) : null;
    });

    const products = await Promise.all(promises);
    return products.filter(Boolean); // Filter out nulls
  } catch (error) {
    console.error("Failed to fetch wishlist products:", error);
    return [];
  }
}
