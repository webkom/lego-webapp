import { randomUUID } from 'node:crypto';
import { test, expect, type Page } from '@playwright/test';
import { fieldError, gotoHydrated, selectFromDropdown } from '../../helpers';

const fillJoblisting = async (page: Page, title: string) => {
  await page.locator('input[name="title"]').fill(title);
  await selectFromDropdown(page, 'company', 'BEKK');
  await selectFromDropdown(page, 'workplaces', 'Oslo');
  await page.getByTestId('lego-editor-content').click();
  await page.keyboard.type('Joblisting text');
};

test('requires the mandatory fields before submitting', async ({ page }) => {
  await gotoHydrated(page, '/joblistings/new');

  await expect(fieldError(page, 'title')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Opprett' })).toBeDisabled();

  await page.locator('input[name="title"]').fill('Sommerjobb hos BEKK');
  await selectFromDropdown(page, 'company', 'BEKK');
  await selectFromDropdown(page, 'workplaces', 'Oslo');

  await page.getByRole('button', { name: 'Opprett' }).click();
  await expect(page.locator('[data-error-field-name]').first()).toBeVisible();
  await expect(page).toHaveURL(/\/joblistings\/new/);
});

test('creates a joblisting and it persists', async ({ page }) => {
  const title = `Sommerjobb ${randomUUID().slice(0, 8)}`;

  await gotoHydrated(page, '/joblistings/new');
  await fillJoblisting(page, title);

  await expect(page.locator('[data-error-field-name]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Opprett' }).click();

  await expect(page).not.toHaveURL(/\/joblistings\/new/);
  await expect(
    page.getByRole('heading', { name: title, level: 1 }),
  ).toBeVisible();

  await gotoHydrated(page, '/joblistings');
  await expect(page.getByRole('link', { name: title })).toBeVisible();
});
