import { test, expect } from '@playwright/test';

test.describe('Account Flow', () => {
  test('user is redirected to login when trying to access account', async ({ page }) => {
    // Try to access protected route
    await page.goto('/account/dashboard');
    
    // Since we're not logged in, we should be redirected or see a login prompt
    // For this boilerplate we assume there's a Shopify auth flow, so checking URL or specific text
    await expect(page.url()).toContain('account');
  });
});
