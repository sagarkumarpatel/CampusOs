import { test, expect } from '@playwright/test';

test('dsa tracker practice flow', async ({ page }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    test.skip('Test credentials not provided in environment variables');
    return;
  }

  // 1. Login
  await page.goto('/auth/login');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]', { hasText: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  // 2. Navigate to Placement Dashboard
  await page.goto('/dashboard/placement');
  
  // 3. Verify Initial DSA Metrics (Total: 2, Solved: 0)
  // Wait for the DSA stats to load by checking for the presence of the total number
  await expect(page.locator('p:text-is("Total") + p')).toHaveText('2');
  await expect(page.locator('p:text-is("Solved") + p')).toHaveText('0');

  // 4. Navigate to DSA Tracker
  await page.locator('a', { hasText: 'Open DSA Tracker' }).click();
  await expect(page).toHaveURL(/\/dashboard\/placement\/dsa/);

  // 5. Expand Arrays Category
  const arraysCategoryButton = page.locator('button', { hasText: 'Arrays' }).first();
  await arraysCategoryButton.click();

  // 6. Mark "Two Sum" as solved
  const twoSumRow = page.locator('tr').filter({ hasText: 'Two Sum' });
  await expect(twoSumRow).toBeVisible();
  
  const checkbox = twoSumRow.locator('input[type="checkbox"]');
  // Ensure it's currently unchecked (based on seed data)
  await expect(checkbox).not.toBeChecked();
  
  // Click the checkbox to mark as solved. We use click() instead of check() 
  // because React controls the state and it updates asynchronously after the API call.
  await checkbox.click();
  await expect(checkbox).toBeChecked();
  
  // 7. Verify solved count/progress updates
  // Since this updates via TanStack Query invalidation, Playwright's auto-retrying assertions are perfect here
  
  // Check the overall category solved count updates to 1/2
  await expect(page.locator('text=1 / 2 Solved')).toBeVisible();

  // Check the specific difficulty count updates (Two Sum is EASY, so it should be 1 / 1 Easy)
  await expect(page.locator('text=1 / 1 Easy')).toBeVisible();

  // Clean up: uncheck it so the test can be run repeatedly without reseeding if needed
  await checkbox.click();
  await expect(checkbox).not.toBeChecked();
  await expect(page.locator('text=0 / 2 Solved')).toBeVisible();
});
