import { cookies } from 'next/headers';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
// In a real application, you must set SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID in your .env
// This is the public Client ID from the Headless channel settings in Shopify Admin.
const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

export async function getOpenIdConfig() {
  if (!domain) throw new Error('Shopify domain not configured');
  
  const url = `https://${domain}/.well-known/openid-configuration`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  
  if (!res.ok) {
    throw new Error('Failed to fetch Shopify openid configuration');
  }
  
  return res.json();
}

// PKCE Helpers using Web Crypto API
export async function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
}

export async function generateCodeChallenge(verifier: string) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function generateAuthUrl(redirectUri: string, state: string, codeChallenge: string) {
  const config = await getOpenIdConfig();
  const url = new URL(config.authorization_endpoint);
  
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('client_id', clientId);
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('scope', 'openid email customer-account-api:full');
  url.searchParams.append('state', state);
  url.searchParams.append('code_challenge', codeChallenge);
  url.searchParams.append('code_challenge_method', 'S256');
  
  return url.toString();
}

export async function exchangeCodeForToken(code: string, codeVerifier: string, redirectUri: string) {
  const config = await getOpenIdConfig();
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const res = await fetch(config.token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to exchange token: ${error}`);
  }
  
  return res.json();
}

export async function refreshAccessToken(refreshToken: string) {
  const config = await getOpenIdConfig();
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken,
  });

  const res = await fetch(config.token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }
  
  return res.json();
}

export async function getCustomerAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get('customer_access_token')?.value;
}

export async function getCustomerRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get('customer_refresh_token')?.value;
}
