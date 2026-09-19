import { randomUUID } from 'node:crypto';
import { test, expect, type Page } from '@playwright/test';
import { checkField, fieldError, gotoHydrated } from '../../helpers';

const COVER = 'cypress/fixtures/images/screenshot.png';

const uploadCover = async (page: Page) => {
  await page.locator('input[type="file"]').setInputFiles(COVER);
  await page.getByRole('button', { name: 'Last opp' }).click();
  await expect(page.getByTestId('Modal__content')).toHaveCount(0);
};

const pickOption = async (page: Page, field: string, value: string) => {
  const input = page.locator(`[id="react-select-${field}-input"]`);
  await input.fill(value);
  await expect(
    page.locator(`[id="react-select-${field}-listbox"]`),
  ).toContainText(value);
  await input.press('Enter');
};

test('requires a cover before an event can be created', async ({ page }) => {
  await gotoHydrated(page, '/events/new');

  await page.locator('input[name="title"]').fill('Ufullstendig event');
  await page.locator('[name="description"]').fill('mer info kommer');
  await page.getByTestId('lego-editor-content').click();
  await page.keyboard.type('mer info kommer');
  await page.locator('input[name="location"]').fill('DT');
  await pickOption(page, 'eventType', 'Bedriftspres');
  await pickOption(page, 'eventStatusType', 'TBA');
  await checkField(page, 'isClarified');

  await page.getByRole('button', { name: 'Opprett' }).click();

  await expect(fieldError(page, 'cover')).toHaveText('Cover er påkrevd');
  await expect(page).toHaveURL(/\/events\/new/);
});

test('creates a TBA event and it persists', async ({ page }) => {
  const title = `Ubestemt event ${randomUUID().slice(0, 8)}`;

  await gotoHydrated(page, '/events/new');
  await uploadCover(page);

  await page.locator('input[name="title"]').fill(title);
  await page.locator('[name="description"]').fill('mer info kommer');
  await page.getByTestId('lego-editor-content').click();
  await page.keyboard.type('mer info kommer');
  await page.locator('input[name="location"]').fill('DT');
  await pickOption(page, 'eventType', 'Bedriftspres');
  await pickOption(page, 'eventStatusType', 'TBA');
  await checkField(page, 'isClarified');

  await page.getByRole('button', { name: 'Opprett' }).click();

  await expect(page).not.toHaveURL(/\/events\/new/);
  await expect(page).toHaveURL(/\/events\//);
  await expect(
    page.getByRole('heading', { name: title, level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('Bedriftspresentasjon').first()).toBeVisible();
  await expect(page.getByText('DT').first()).toBeVisible();

  const eventUrl = page.url();
  await gotoHydrated(page, eventUrl);
  await expect(
    page.getByRole('heading', { name: title, level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('mer info kommer').first()).toBeVisible();
});

test('creates a normal event with two pools', async ({ page }) => {
  const title = `Normal event ${randomUUID().slice(0, 8)}`;

  await gotoHydrated(page, '/events/new');
  await uploadCover(page);

  await page.locator('input[name="title"]').fill(title);
  await page.locator('[name="description"]').fill('normal event');
  await page.getByTestId('lego-editor-content').click();
  await page.keyboard.type('normal event');
  await page.locator('input[name="location"]').fill('R4');
  await pickOption(page, 'eventType', 'Bedriftspres');
  await pickOption(page, 'eventStatusType', 'Vanlig');

  await page.locator('[name="pools[0].name"]').fill('WebkomPool');
  await page.locator('[name="pools[0].capacity"]').fill('20');
  await pickOption(page, 'pools[0].permissionGroups', 'Webkom');

  await page.getByRole('button', { name: 'Legg til ny pool' }).click();
  await page.locator('[name="pools[1].name"]').fill('BedkomPool');
  await page.locator('[name="pools[1].capacity"]').fill('30');
  await pickOption(page, 'pools[1].permissionGroups', 'Bedkom');

  await checkField(page, 'isClarified');
  await page.getByRole('button', { name: 'Opprett' }).click();

  await expect(page).not.toHaveURL(/\/events\/new/);
  await expect(
    page.getByRole('heading', { name: title, level: 1 }),
  ).toBeVisible();

  const eventUrl = page.url();
  await gotoHydrated(page, eventUrl);
  await expect(page.getByText('0/50')).toBeVisible();
  await expect(page.getByText('R4').first()).toBeVisible();
  await expect(page.getByText('Bedriftspresentasjon').first()).toBeVisible();
});
