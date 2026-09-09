import { test, expect } from '@playwright/test';

test('career tracking registration flow', async ({ page }) => {
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

  // 2. Navigate to Career Tracking
  await page.goto('/dashboard/career');

  // 3. Verify the listing is visible
  const card = page.locator('.rounded-2xl', { hasText: 'Playwright E2E Corp' });
  await expect(card).toBeVisible();

  // Verify details
  await expect(card.locator('text=Software Engineering Intern')).toBeVisible();
  await expect(card.locator('text=Remote')).toBeVisible();
  await expect(card.locator('text=₹50,000 / month')).toBeVisible();

  // Verify external link
  const applyLink = card.locator('a', { hasText: 'Apply' });
  await expect(applyLink).toHaveAttribute('href', 'https://playwright.dev/careers');

  // 4. Test Registration Toggle Flow
  const registerButton = card.locator('button', { hasText: 'Registered' });
  
  // Initial state: Unregistered (icon has text-text-muted)
  await expect(registerButton.locator('svg')).toHaveClass(/text-text-muted/);
  
  // Check student count is 0
  await expect(card.locator('text=0 Students')).toBeVisible();

  // Register
  await registerButton.click();

  // Should update to 1 student
  await expect(card.locator('text=1 Student')).toBeVisible();
  
  // Icon should change to accent color
  await expect(registerButton.locator('svg')).toHaveClass(/text-accent-coral/);

  // Unregister
  await registerButton.click();

  // Should revert to 0 students
  await expect(card.locator('text=0 Students')).toBeVisible();
  await expect(registerButton.locator('svg')).toHaveClass(/text-text-muted/);
});
