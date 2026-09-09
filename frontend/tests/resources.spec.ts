import { test, expect } from '@playwright/test';

test('academic resources viewing flow', async ({ page }) => {
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

  // 2. Navigate to Resources Hub
  await page.goto('/dashboard/resources');

  // 3. Core Subject Notes
  const subjectNoteCard = page.locator('h3:text-is("Playwright E2E Subject Note")').locator('..').locator('..'); // go up to the card container
  await expect(subjectNoteCard).toBeVisible();
  const subjectNoteLink = subjectNoteCard.locator('a', { hasText: 'Open Notes' });
  await expect(subjectNoteLink).toHaveAttribute('href', 'https://playwright.dev/note');

  // 4. Previous Year Questions
  const pyqCard = page.locator('h3:text-is("Playwright E2E PYQ")').locator('..').locator('..');
  await expect(pyqCard).toBeVisible();
  await expect(pyqCard.locator('text=Exam Year: 2026')).toBeVisible();
  await expect(pyqCard.locator('text=Sem 8')).toBeVisible();
  const pyqLink = pyqCard.locator('a', { hasText: 'Open Question Paper' });
  await expect(pyqLink).toHaveAttribute('href', 'https://playwright.dev/pyq');

  // 5. Interview Notes
  const interviewNoteRow = page.locator('h3:text-is("Playwright E2E Interview")').locator('..').locator('..');
  await expect(interviewNoteRow).toBeVisible();
  const interviewNoteLink = interviewNoteRow.locator('a', { hasText: 'Open Notes' });
  await expect(interviewNoteLink).toHaveAttribute('href', 'https://playwright.dev/interview');

  // 6. Cheat Sheets
  const cheatSheetCard = page.locator('h3:text-is("Playwright E2E Cheat Sheet")').locator('..').locator('..');
  await expect(cheatSheetCard).toBeVisible();
  
  // Click the cheat sheet image to open the Image Preview Modal
  const cheatSheetImage = cheatSheetCard.locator('img');
  await cheatSheetImage.click();

  // Verify the preview modal renders successfully and the image is visible
  const previewModal = page.locator('.fixed.inset-0.z-\\[100\\]');
  await expect(previewModal).toBeVisible();
  await expect(previewModal.locator('img')).toBeVisible();

  // Click the Close button (the 'X' icon or outside) to dismiss the image preview
  // It's a button inside the modal
  await previewModal.locator('button').click();

  // Verify modal disappeared
  await expect(previewModal).not.toBeVisible();
});
