import { test, expect } from '@playwright/test';
import { gotoHydrated } from '../../helpers';

test.beforeEach(async ({ page }) => {
  await gotoHydrated(page, '/users/me');
  await page.getByRole('button', { name: 'Vis ABA-ID' }).click();
});

test('opens on the front of the card', async ({ page }) => {
  const card = page.getByRole('dialog', { name: 'ABA-ID' });
  await expect(card).toBeVisible();

  const box = await card.locator('canvas').boundingBox();
  expect(box?.width).toBeGreaterThan(0);
  expect(box?.height).toBeGreaterThan(0);

  const front = page.getByTestId('AbaId__front');
  await expect(front).toHaveAttribute('aria-hidden', 'false');
  await expect(front).toContainText('webkom');
  await expect(front).toContainText('abakus.no');
});

test('flips to the back and shows the username', async ({ page }) => {
  const front = page.getByTestId('AbaId__front');
  const back = page.getByTestId('AbaId__back');
  const flip = page.getByRole('button', { name: 'Snu kortet' });

  await expect(back).toHaveAttribute('aria-hidden', 'true');
  await expect(flip).toHaveAttribute('aria-pressed', 'false');

  await flip.click();

  await expect(flip).toHaveAttribute('aria-pressed', 'true');
  await expect(front).toHaveAttribute('aria-hidden', 'true');
  await expect(back).toHaveAttribute('aria-hidden', 'false');
  await expect(back).toContainText('Brukernavn');
  await expect(back).toContainText('webkom');
});

test('closes on escape and reopens on the front', async ({ page }) => {
  await page.getByRole('button', { name: 'Snu kortet' }).click();
  await page.keyboard.press('Escape');

  await expect(page.getByRole('dialog', { name: 'ABA-ID' })).toBeHidden();

  await page.getByRole('button', { name: 'Vis ABA-ID' }).click();
  await expect(
    page.getByRole('button', { name: 'Snu kortet' }),
  ).toHaveAttribute('aria-pressed', 'false');
});
