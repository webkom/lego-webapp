import { test, expect } from '@playwright/test';

test('is authenticated', async ({ page }) => {
  await page.goto('/users/me');
  await expect(page.getByRole('heading', { name: 'webkom' })).toBeVisible();
});
