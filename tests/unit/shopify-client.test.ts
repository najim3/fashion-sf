import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shopifyFetch, shopify } from '@/lib/shopify/client';

// Mock the internal Shopify client
vi.mock('@/lib/shopify/client', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    shopify: {
      request: vi.fn(),
    },
  };
});

describe('Shopify Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Silence console.error for expected errors
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns data on successful request', async () => {
    const mockData = { collection: { id: '123' } };
    (shopify.request as any).mockResolvedValue({ data: mockData });

    const result = await shopifyFetch({ query: 'query { collection { id } }' });
    
    expect(result.data).toEqual(mockData);
    expect(shopify.request).toHaveBeenCalledWith('query { collection { id } }', { variables: undefined });
  });

  it('throws error when GraphQL returns errors array', async () => {
    (shopify.request as any).mockResolvedValue({ 
      data: null,
      errors: [{ message: 'GraphQL Error' }] 
    });

    await expect(shopifyFetch({ query: 'query' })).rejects.toThrow('Shopify API Error');
  });

  it('propagates network errors', async () => {
    const networkError = new Error('Network Failure');
    (shopify.request as any).mockRejectedValue(networkError);

    await expect(shopifyFetch({ query: 'query' })).rejects.toThrow('Network Failure');
  });
});
