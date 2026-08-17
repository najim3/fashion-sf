import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';
import { mapShopifyProductToProduct } from '@/lib/shopify/mapper';

describe('Utils', () => {
  describe('cn()', () => {
    it('merges tailwind classes correctly', () => {
      expect(cn('p-4', 'm-4')).toBe('p-4 m-4');
      expect(cn('p-4', { 'bg-red-500': true, 'bg-blue-500': false })).toBe('p-4 bg-red-500');
    });

    it('handles tailwind conflicts', () => {
      expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
    });
  });
});

describe('Shopify Mapper', () => {
  describe('mapShopifyProductToProduct', () => {
    it('returns null if no product is provided', () => {
      expect(mapShopifyProductToProduct(null)).toBeNull();
    });

    it('maps standard Shopify product to internal format', () => {
      const mockShopifyProduct = {
        id: 'gid://shopify/Product/123',
        handle: 'test-product',
        title: 'Test Product',
        vendor: 'Test Vendor',
        priceRange: {
          minVariantPrice: { amount: '10.00', currencyCode: 'USD' }
        },
        images: {
          nodes: [
            { url: 'https://example.com/image1.jpg' },
            { url: 'https://example.com/image2.jpg' }
          ]
        },
        tags: ['new', 'summer']
      };

      const mapped = mapShopifyProductToProduct(mockShopifyProduct);
      
      expect(mapped).toEqual({
        id: 'gid://shopify/Product/123',
        handle: 'test-product',
        title: 'Test Product',
        vendor: 'Test Vendor',
        price: { amount: '10.00', currencyCode: 'USD' },
        compareAtPrice: undefined,
        image: 'https://example.com/image1.jpg',
        secondaryImage: 'https://example.com/image2.jpg',
        isNew: true
      });
    });
  });
});
