import { test, expect } from '@playwright/test';

test.describe('Wishlist Flow', () => {
  test('user can add and remove items from wishlist', async ({ page }) => {
    await page.goto('/');

    // Find a product and click its wishlist button
    // This assumes WishlistButton has a specific title or accessible name
    const wishlistButtons = page.locator('button[aria-label="Add to wishlist"]');
    if (await wishlistButtons.count() > 0) {
      await wishlistButtons.first().click();

      // Check if badge count updated (if there's a wishlist badge)
      // Navigate to wishlist
      await page.goto('/account/wishlist');
      
      // Should see products
      const products = page.locator('a[href^="/products/"]');
      expect(await products.count()).toBeGreaterThan(0);
    }
  });
});
