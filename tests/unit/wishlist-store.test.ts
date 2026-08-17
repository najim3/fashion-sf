import { describe, it, expect, beforeEach } from 'vitest';
import { useWishlistStore } from '@/stores/wishlist-store';

describe('Wishlist Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    useWishlistStore.setState({ items: [] });
  });

  it('starts with an empty wishlist', () => {
    expect(useWishlistStore.getState().items).toEqual([]);
  });

  it('can add an item', () => {
    useWishlistStore.getState().addItem('product-1');
    expect(useWishlistStore.getState().items).toContain('product-1');
  });

  it('does not add duplicate items', () => {
    useWishlistStore.getState().addItem('product-1');
    useWishlistStore.getState().addItem('product-1');
    expect(useWishlistStore.getState().items).toEqual(['product-1']);
  });

  it('can remove an item', () => {
    useWishlistStore.getState().addItem('product-1');
    useWishlistStore.getState().addItem('product-2');
    useWishlistStore.getState().removeItem('product-1');
    expect(useWishlistStore.getState().items).toEqual(['product-2']);
  });

  it('can toggle an item', () => {
    // Add
    useWishlistStore.getState().toggleItem('product-1');
    expect(useWishlistStore.getState().items).toContain('product-1');
    
    // Remove
    useWishlistStore.getState().toggleItem('product-1');
    expect(useWishlistStore.getState().items).not.toContain('product-1');
  });

  it('correctly reports if an item is in the wishlist', () => {
    expect(useWishlistStore.getState().isInWishlist('product-1')).toBe(false);
    useWishlistStore.getState().addItem('product-1');
    expect(useWishlistStore.getState().isInWishlist('product-1')).toBe(true);
  });

  it('can clear the wishlist', () => {
    useWishlistStore.getState().addItem('product-1');
    useWishlistStore.getState().addItem('product-2');
    useWishlistStore.getState().clearWishlist();
    expect(useWishlistStore.getState().items).toEqual([]);
  });
});
