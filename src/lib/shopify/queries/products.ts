import { shopifyFetch } from '../client';

export async function getProducts({ sortKey = 'BEST_SELLING', reverse = false, query = '', first = 20, after }: { sortKey?: string; reverse?: boolean; query?: string; first?: number; after?: string } = {}) {
  const gql = `
    query getProducts($first: Int, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
        pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        nodes {
          id
          handle
          title
          vendor
          availableForSale
          images(first: 2) { nodes { url } }
          priceRange { minVariantPrice { amount currencyCode } }
          variants(first: 1) { nodes { id availableForSale price { amount currencyCode } compareAtPrice { amount currencyCode } } }
        }
      }
    }
  `;
  const res = await shopifyFetch<any>({ query: gql, variables: { first, after, sortKey, reverse, query } });
  return {
    products: res.data?.products?.nodes || [],
    pageInfo: res.data?.products?.pageInfo
  };
}

export async function getProductByHandle(handle: string) {
  const gql = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        vendor
        description
        descriptionHtml
        availableForSale
        images(first: 10) { nodes { url altText } }
        options { id name values }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 250) {
          nodes {
            id
            title
            availableForSale
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
            image { url altText }
          }
        }
      }
    }
  `;
  const res = await shopifyFetch<any>({ query: gql, variables: { handle } });
  return res.data?.product;
}

export async function getProductRecommendations(productId: string) {
  const gql = `
    query getProductRecommendations($productId: ID!) {
      productRecommendations(productId: $productId) {
        id
        handle
        title
        vendor
        availableForSale
        images(first: 2) { nodes { url } }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 1) { nodes { id availableForSale price { amount currencyCode } compareAtPrice { amount currencyCode } } }
      }
    }
  `;
  const res = await shopifyFetch<any>({ query: gql, variables: { productId } });
  return res.data?.productRecommendations || [];
}

