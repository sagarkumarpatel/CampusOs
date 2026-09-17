import { test, expect } from '@playwright/test';

test('dashboard modules summary flow', async ({ page }) => {
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
  
  // Wait for navigation to dashboard
  await expect(page).toHaveURL(/\/dashboard/);

  // The dashboard cards animate in, wait for the container to be visible
  await expect(page.locator('h1', { hasText: 'Welcome back' })).toBeVisible({ timeout: 10000 });

  // 2. Verify Placement Card (Static)
  await expect(page.locator('h3', { hasText: 'Placement Preparation' })).toBeVisible();

  // 3. Verify Mentor Card (Dynamic)
  // We seeded "Playwright Mentor", "E2E Senior Engineer @ Playwright E2E Corp"
  await expect(page.locator('h3', { hasText: 'My Mentor' })).toBeVisible();
  await expect(page.locator('text=Playwright Mentor')).toBeVisible();
  await expect(page.locator('text=E2E Senior Engineer @ Playwright E2E Corp')).toBeVisible();

  // 4. Verify Events Card (Dynamic)
  // We seeded "Playwright E2E Test Hackathon"
  await expect(page.locator('h3', { hasText: 'Upcoming Events' })).toBeVisible();
  await expect(page.locator('text=Playwright E2E Test Hackathon')).toBeVisible();

  // 5. Verify Resources Card (Dynamic)
  // We seeded 4 resources, so it should say "Total resources: 4"
  // And latest resource name "Playwright E2E Cheat Sheet" or similar should be there.
  await expect(page.locator('h3', { hasText: 'Academic Resources' })).toBeVisible();
  await expect(page.locator('text=/Total resources: \\d+/')).toBeVisible();

  // 6. Verify Career Tracking Card (Dynamic)
  // We seeded "Playwright E2E Corp", "Software Engineering Intern", "INTERNSHIP"
  await expect(page.locator('h3', { hasText: 'Career Tracking' })).toBeVisible();
  await expect(page.getByText('Playwright E2E Corp', { exact: true })).toBeVisible();
  await expect(page.locator('text=Software Engineering Intern')).toBeVisible();
  await expect(page.getByText('INTERNSHIP', { exact: true })).toBeVisible();
});
