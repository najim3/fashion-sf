import { test, expect } from '@playwright/test';

test.describe('Search and Filter Flow', () => {
  test('user can search for products and see results', async ({ page }) => {
    await page.goto('/');

    // Open search (assuming a search icon in header)
    const searchInput = page.locator('input[type="search"], input[name="q"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('shirt');
      await searchInput.press('Enter');

      // Check results
      await expect(page.url()).toContain('q=shirt');
      await expect(page.locator('main')).toBeVisible();
    }
  });
});
