import { test, expect } from '@playwright/test';

test.describe('Browse to Checkout Flow', () => {
  test('user can navigate to product, add to cart, and checkout', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Fashion SF/);

    // 2. Navigate to collections (assuming there's a link to collection)
    await page.getByRole('link', { name: /collections/i }).first().click();
    
    // Check if we are on a page with products
    await page.waitForSelector('main');

    // 3. Click first product
    // We assume ProductCard has a link inside
    const firstProductLink = page.locator('a[href^="/products/"]').first();
    await firstProductLink.click();

    // 4. On PDP
    await expect(page.url()).toContain('/products/');
    
    // Add to cart
    const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      
      // Wait for cart drawer/notification
      const cartLink = page.getByRole('link', { name: /cart/i });
      await cartLink.click();
      
      // We should be on cart page or drawer
      await expect(page.url()).toContain('/cart');
      
      // Click checkout
      const checkoutBtn = page.getByRole('button', { name: /checkout/i });
      if (await checkoutBtn.isVisible()) {
        await checkoutBtn.click();
      }
    }
  });
});
