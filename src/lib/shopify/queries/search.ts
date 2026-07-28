import { shopifyFetch } from '../client';

export async function predictiveSearch({ query }: { query: string }) {
  const gql = `
    query predictiveSearch($query: String!) {
      predictiveSearch(query: $query) {
        queries { text }
        products {
          id
          handle
          title
          vendor
          featuredImage { url }
          priceRange { minVariantPrice { amount currencyCode } }
        }
        collections { id handle title }
      }
    }
  `;
  const res = await shopifyFetch({ query: gql, variables: { query } });
  return res.data?.predictiveSearch || { queries: [], products: [], collections: [] };
}
