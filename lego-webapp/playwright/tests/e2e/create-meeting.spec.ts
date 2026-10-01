import { randomUUID } from 'node:crypto';
import { test, expect, type Page } from '@playwright/test';
import { fieldError, gotoHydrated } from '../../helpers';

const fillMeeting = async (page: Page, title: string, report: string) => {
  await page.getByPlaceholder('Ny tittel for møte').fill(title);
  await page.getByTestId('lego-editor-content').click();
  await page.keyboard.type(report);
  await page.locator('input[name="useMazemap"]').click();
  await page.locator('input[name="location"]').fill('Test location');
};

test('reports validation errors on an incomplete meeting', async ({ page }) => {
  await gotoHydrated(page, '/meetings/new');

  await expect(page.locator('[data-error-field-name]')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Opprett møte' }),
  ).toBeDisabled();

  await page.getByPlaceholder('Ny tittel for møte').fill('Ufullstendig møte');
  await page.getByRole('button', { name: 'Opprett møte' }).click();

  await expect(fieldError(page, 'report')).toHaveText(
    'Referatet kan ikke være tomt',
  );
  await expect(fieldError(page, 'mazemapPoi')).toHaveText(
    'Sted eller MazeMap-rom er påkrevd',
  );
  await expect(fieldError(page, 'title')).toHaveCount(0);
});

test('creates a meeting and it persists', async ({ page }) => {
  const title = `Webkom møte ${randomUUID().slice(0, 8)}`;

  await gotoHydrated(page, '/meetings/new');
  await fillMeeting(page, title, 'Meeting plan');
  await page.getByRole('button', { name: 'Opprett møte' }).click();

  await expect(
    page.getByRole('heading', { name: title, level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('Test location')).toBeVisible();
  await expect(page.getByText('Meeting plan')).toBeVisible();

  const meetingUrl = page.url();
  await gotoHydrated(page, meetingUrl);
  await expect(
    page.getByRole('heading', { name: title, level: 1 }),
  ).toBeVisible();
});

test('edits a meeting and the change persists', async ({ page }) => {
  const title = `Webkom møte ${randomUUID().slice(0, 8)}`;
  const editedTitle = `${title} redigert`;

  await gotoHydrated(page, '/meetings/new');
  await fillMeeting(page, title, 'Meeting plan');
  await page.getByRole('button', { name: 'Opprett møte' }).click();
  await expect(
    page.getByRole('heading', { name: title, level: 1 }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Rediger' }).click();
  await page.getByPlaceholder('Ny tittel for møte').fill(editedTitle);
  await page.getByRole('button', { name: 'Lagre endringer' }).click();

  await expect(
    page.getByRole('heading', { name: editedTitle, level: 1 }),
  ).toBeVisible();

  const meetingUrl = page.url();
  await gotoHydrated(page, meetingUrl);
  await expect(
    page.getByRole('heading', { name: editedTitle, level: 1 }),
  ).toBeVisible();
});

test('clears validation errors as the fields are filled', async ({ page }) => {
  await gotoHydrated(page, '/meetings/new');

  await page.getByPlaceholder('Ny tittel for møte').fill('Ufullstendig møte');
  await page.getByRole('button', { name: 'Opprett møte' }).click();
  await expect(fieldError(page, 'report')).toBeVisible();

  await page.getByTestId('lego-editor-content').click();
  await page.keyboard.type('Meeting plan');
  await expect(fieldError(page, 'report')).toHaveCount(0);

  await page.locator('input[name="useMazemap"]').click();
  await page.getByRole('button', { name: 'Opprett møte' }).click();
  await expect(fieldError(page, 'location')).toBeVisible();

  await page.locator('input[name="location"]').fill('Test location');
  await expect(fieldError(page, 'location')).toHaveCount(0);
  await expect(page.locator('[data-error-field-name]')).toHaveCount(0);
});
