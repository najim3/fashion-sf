import { getCustomerAccessToken } from './auth';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION || '2024-04';

export async function customerFetch<T = any>({
  query,
  variables,
}: {
  query: string;
  variables?: any;
}): Promise<{ data: T; errors?: any[] }> {
  const token = await getCustomerAccessToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const endpoint = `https://${domain}/account/customer/api/${apiVersion}/graphql`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Customer API Network Error:', errorText);
    throw new Error('Customer API Error');
  }

  const json = await res.json();
  if (json.errors) {
    console.error('Customer API GraphQL Errors:', JSON.stringify(json.errors, null, 2));
    throw new Error('Customer API GraphQL Error');
  }

  return json;
}
