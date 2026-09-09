import { test, expect } from '@playwright/test';

test('events list and details flow', async ({ page }) => {
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

  // 2. Navigate to Events Hub
  await page.goto('/dashboard/events');

  // 3. Verify the Event is visible in the list
  const eventTitle = 'Playwright E2E Test Hackathon';
  // Use generic locator to wait for the element
  await expect(page.locator(`text=${eventTitle}`)).toBeVisible();
  
  // Now explicitly get the card by heading text to click it
  const eventCard = page.locator('.grid').locator('div', { has: page.locator(`h3:text-is("${eventTitle}")`) }).first();
  await expect(eventCard).toBeVisible();

  // 4. Click the event to open details modal
  await eventCard.click();

  // 5. Verify modal details
  // Wait for modal to appear (contains the title as h2)
  const modal = page.locator('.fixed.inset-0', { has: page.locator(`h2:text-is("${eventTitle}")`) });
  await expect(modal).toBeVisible();

  await expect(modal.locator('text=E2E Testing Team')).toBeVisible();
  await expect(modal.locator('span', { hasText: /^Hackathon$/ })).toBeVisible(); // Category label exact match
  await expect(modal.locator('text=Virtual')).toBeVisible(); // Location

  // 6. Verify Registration Link
  const registerButton = modal.locator('a', { hasText: 'Register for Event' });
  await expect(registerButton).toBeVisible();
  await expect(registerButton).toHaveAttribute('href', 'https://playwright.dev/test-event');

  // 7. Close modal
  await modal.locator('button', { hasText: 'Close' }).click();
  
  // Verify modal disappeared
  await expect(modal).not.toBeVisible();
});
