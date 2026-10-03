import { test, expect } from '@playwright/test';

const eventLinks = 'a[href^="/events/"]';

test.describe('public frontpage', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('shows the landing page', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Velkommen til Abakus', level: 1 }),
    ).toBeVisible();

    for (const heading of [
      'Bedpres og kurs',
      'Sosialt',
      'Vårt studentmagasin',
      'Nyttige lenker',
    ]) {
      await expect(
        page.getByRole('heading', { name: heading, level: 3 }),
      ).toBeVisible();
    }

    await expect(page.locator(eventLinks).first()).toBeVisible();
  });
});

test.describe('authenticated frontpage', () => {
  test('shows personalised sections', async ({ page }) => {
    await page.goto('/');

    for (const heading of [
      'Bedpres og kurs',
      'Arrangementer',
      'Påmeldinger',
      'Artikler',
    ]) {
      await expect(
        page.getByRole('heading', { name: heading, level: 3 }),
      ).toBeVisible();
    }

    await expect(
      page.getByRole('heading', { name: /oppslag/i, level: 3 }),
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Artikkel uten AUTH', level: 2 }),
    ).toBeVisible();
  });

  test('reveals more events behind show more', async ({ page }) => {
    await page.goto('/');
    await page.locator('body[data-hydrated="true"]').waitFor();

    const events = page.locator(eventLinks);
    const before = await events.count();

    await page.getByTestId('frontpage-show-more').getByRole('button').click();

    await expect(events).not.toHaveCount(before);
  });
});
