import { test, expect } from '@playwright/test';

test('company interest form renders', async ({ page }) => {
  await page.goto('/interesse');
  await expect(
    page.getByRole('heading', { name: 'Meld interesse' }),
  ).not.toBeVisible();
});
