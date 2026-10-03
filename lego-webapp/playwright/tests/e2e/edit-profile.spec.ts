import { randomUUID } from 'node:crypto';
import { test, expect } from '@playwright/test';
import { fieldError, gotoHydrated } from '../../helpers';

const SETTINGS = '/users/me/settings/profile';

test('shows the current profile values', async ({ page }) => {
  await gotoHydrated(page, SETTINGS);

  await expect(page.locator('input[name="username"]')).toHaveValue('webkom');
  await expect(page.locator('input[name="username"]')).toBeDisabled();
  await expect(page.locator('input[name="firstName"]')).toHaveValue('webkom');
  await expect(page.locator('input[name="lastName"]')).toHaveValue('webkom');
  await expect(page.locator('input[name="email"]')).toBeEnabled();
});

test('saves a profile change and it persists', async ({ page }) => {
  const allergies = `gluten ${randomUUID().slice(0, 8)}`;
  const email = `webkom-${randomUUID().slice(0, 8)}@web.kom`;

  await gotoHydrated(page, SETTINGS);
  await expect(
    page.getByRole('button', { name: 'Lagre endringer' }),
  ).toBeDisabled();

  await page.locator('input[name="allergies"]').fill(allergies);
  await page.locator('input[name="email"]').fill(email);
  await page.getByRole('button', { name: 'Lagre endringer' }).click();

  await expect(page.getByText('Oppdatering av bruker fullført')).toBeVisible();
  await expect(page).toHaveURL(/\/users\/me/);

  await gotoHydrated(page, SETTINGS);
  await expect(page.locator('input[name="allergies"]')).toHaveValue(allergies);
  await expect(page.locator('input[name="email"]')).toHaveValue(email);
});

test('requires the mandatory profile fields', async ({ page }) => {
  await gotoHydrated(page, SETTINGS);

  await page.locator('input[name="firstName"]').fill('');
  await page.locator('input[name="firstName"]').blur();
  await expect(fieldError(page, 'firstName')).toContainText('må fylles ut');

  await page.locator('input[name="lastName"]').fill('');
  await page.locator('input[name="lastName"]').blur();
  await expect(fieldError(page, 'lastName')).toContainText('må fylles ut');

  await page.locator('input[name="email"]').fill('');
  await page.locator('input[name="email"]').blur();
  await expect(fieldError(page, 'email')).toContainText('må fylles ut');

  await page.locator('input[name="allergies"]').fill('');
  await page.locator('input[name="allergies"]').blur();
  await expect(fieldError(page, 'allergies')).toHaveCount(0);
});

test('rejects an abakus.no email', async ({ page }) => {
  await gotoHydrated(page, SETTINGS);

  await page.locator('input[name="email"]').fill('webkom@abakus.no');
  await page.locator('input[name="email"]').blur();
  await page.getByRole('button', { name: 'Lagre endringer' }).click();

  await expect(fieldError(page, 'email')).toContainText(
    'Kan ikke være Abakus-e-post',
  );
});
