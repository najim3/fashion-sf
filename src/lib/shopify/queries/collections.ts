import { shopifyFetch } from '../client';

export async function getCollections({ first = 20, after }: { first?: number; after?: string } = {}) {
  const gql = `
    query getCollections($first: Int, $after: String) {
      collections(first: $first, after: $after) {
        nodes { id handle title description image { url } }
      }
    }
  `;
  const res = await shopifyFetch<any>({ query: gql, variables: { first, after } });
  return res.data?.collections?.nodes || [];
}

export async function getCollectionByHandle(handle: string) {
  const gql = `
    query getCollectionByHandle($handle: String!) {
      collection(handle: $handle) {
        id handle title description image { url }
      }
    }
  `;
  const res = await shopifyFetch<any>({ query: gql, variables: { handle } });
  return res.data?.collection;
}

export async function getCollectionProducts({ handle, sortKey = 'COLLECTION_DEFAULT', reverse = false, first = 50, after }: { handle: string; sortKey?: string; reverse?: boolean; first?: number; after?: string }) {
  const gql = `
    query getCollectionProducts($handle: String!, $first: Int, $after: String, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
      collection(handle: $handle) {
        products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
          pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
          nodes {
            id handle title vendor
            images(first: 2) { nodes { url } }
            priceRange { minVariantPrice { amount currencyCode } }
            variants(first: 1) { nodes { price { amount currencyCode } compareAtPrice { amount currencyCode } } }
          }
        }
      }
    }
  `;
  const res = await shopifyFetch<any>({ query: gql, variables: { handle, first, after, sortKey, reverse } });
  return {
    products: res.data?.collection?.products?.nodes || [],
    pageInfo: res.data?.collection?.products?.pageInfo
  };
}
