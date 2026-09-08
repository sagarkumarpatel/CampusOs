import { test, expect } from '@playwright/test';

test('complete authentication flow', async ({ page }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    test.skip('Test credentials not provided in environment variables');
    return;
  }

  // 1. Open the landing page
  await page.goto('/');

  // 2. Click "Get Started"
  const getStartedButton = page.locator('a[href="/auth/login"]', { hasText: 'Get Started' }).first();
  await getStartedButton.click();

  // 3. Verify the login page loads
  await expect(page).toHaveURL(/\/auth\/login/);
  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');
  await expect(emailInput).toBeVisible();

  // 4. Login using a dedicated test account
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await page.locator('button[type="submit"]', { hasText: 'Sign In' }).click();

  // 5. Verify successful navigation to the dashboard
  await expect(page).toHaveURL(/\/dashboard/);
  const signOutButton = page.locator('button', { hasText: 'Sign Out' });
  await expect(signOutButton).toBeVisible();

  // 6. Refresh the page and verify the user remains authenticated
  await page.reload();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(signOutButton).toBeVisible();

  // 7. Logout
  await signOutButton.click();

  // 8. Verify the user is returned to the logged-out state
  await expect(page).toHaveURL("http://localhost:3000/");
  const getStartedButtonAgain = page.locator('a[href="/auth/login"]', { hasText: 'Get Started' }).first();
  await expect(getStartedButtonAgain).toBeVisible();
});
