import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopify = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION || '2024-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
});

export async function shopifyFetch<T = any>({ query, variables }: { query: string, variables?: any }): Promise<{ data: T }> {
  try {
    const { data, errors } = await shopify.request(query, { variables });
    if (errors) {
      console.error('Shopify API Errors:', JSON.stringify(errors, null, 2));
      throw new Error('Shopify API Error');
    }
    return { data };
  } catch (error) {
    throw error;
  }
}
