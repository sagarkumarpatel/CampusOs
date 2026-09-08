import { test, expect } from '@playwright/test';

test('landing page loads and displays get started button', async ({ page }) => {
  // Navigate to the landing page
  await page.goto('/');

  // Verify the page title or a key heading is visible
  // The landing page has an h1 with "Unlock Your Campus"
  const heading = page.locator('h1', { hasText: 'Unlock Your Campus' });
  await expect(heading).toBeVisible();

  // Verify the entry point (Get Started button that links to /auth/login) is visible
  const getStartedButton = page.locator('a[href="/auth/login"]', { hasText: 'Get Started' }).first();
  await expect(getStartedButton).toBeVisible();
});
