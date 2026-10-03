import { randomUUID } from 'node:crypto';
import { test, expect, type Page } from '@playwright/test';
import { checkField, fieldError, gotoHydrated } from '../../helpers';

const COVER = 'playwright/fixtures/cover.png';

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

test('requires all mandatory fields before an event can be created', async ({
  page,
}) => {
  await gotoHydrated(page, '/events/new');

  for (const field of ['cover', 'title', 'description', 'eventType']) {
    await expect(fieldError(page, field)).toHaveCount(0);
  }
  await expect(page.getByRole('button', { name: 'Opprett' })).toBeDisabled();

  // Touching the editor makes the form dirty and unlocks submit.
  await page.getByTestId('lego-editor-content').click();
  await page.keyboard.type('test');
  await page.getByRole('button', { name: 'Opprett' }).click();

  await expect(fieldError(page, 'cover')).toHaveText('Cover er påkrevd');
  for (const field of ['title', 'description', 'eventType', 'isClarified']) {
    await expect(fieldError(page, field)).toBeVisible();
  }

  await uploadCover(page);
  await expect(fieldError(page, 'cover')).toHaveCount(0);

  await page.locator('input[name="title"]').fill('Testevent');
  await expect(fieldError(page, 'title')).toHaveCount(0);

  await page.locator('[name="description"]').fill('blir fett');
  await expect(fieldError(page, 'description')).toHaveCount(0);

  await pickOption(page, 'eventType', 'Sosialt');
  await expect(fieldError(page, 'eventType')).toHaveCount(0);

  await checkField(page, 'isClarified');
  await expect(fieldError(page, 'isClarified')).toHaveCount(0);

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

test('creates an event with a company and responsible group', async ({
  page,
}) => {
  const title = `Standard event ${randomUUID().slice(0, 8)}`;

  await gotoHydrated(page, '/events/new');
  await uploadCover(page);

  await page.locator('input[name="title"]').fill(title);
  await page.locator('[name="description"]').fill('standard event');
  await page.getByTestId('lego-editor-content').click();
  await page.keyboard.type('standard event');
  await pickOption(page, 'eventType', 'Bedriftspres');
  await page.locator('input[name="location"]').fill('DT');
  await pickOption(page, 'company', 'BEKK');
  await pickOption(page, 'responsibleGroup', 'Bedkom');
  await checkField(page, 'isClarified');

  await page.getByRole('button', { name: 'Opprett' }).click();
  await expect(page).not.toHaveURL(/\/events\/new/);

  const eventUrl = page.url();
  await gotoHydrated(page, eventUrl);
  await expect(
    page.getByRole('heading', { name: title, level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('BEKK').first()).toBeVisible();
  await expect(page.getByText('Bedriftspresentasjon').first()).toBeVisible();
});

test('creates an open event without registration', async ({ page }) => {
  const title = `Open event ${randomUUID().slice(0, 8)}`;

  await gotoHydrated(page, '/events/new');
  await uploadCover(page);

  await page.locator('input[name="title"]').fill(title);
  await page.locator('[name="description"]').fill('open event');
  await page.getByTestId('lego-editor-content').click();
  await page.keyboard.type('open event');
  await pickOption(page, 'eventType', 'Fest');
  await pickOption(page, 'eventStatusType', 'uten påmelding');
  await page.locator('input[name="location"]').fill('Kjellern');
  await checkField(page, 'isClarified');

  await page.getByRole('button', { name: 'Opprett' }).click();
  await expect(page).not.toHaveURL(/\/events\/new/);

  const eventUrl = page.url();
  await gotoHydrated(page, eventUrl);
  await expect(
    page.getByRole('heading', { name: title, level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('Fest').first()).toBeVisible();
  await expect(page.getByText('Kjellern').first()).toBeVisible();
});

test('creates an infinite event with consent and feedback', async ({
  page,
}) => {
  const title = `Infinite event ${randomUUID().slice(0, 8)}`;

  await gotoHydrated(page, '/events/new');
  await uploadCover(page);

  await page.locator('input[name="title"]').fill(title);
  await page.locator('[name="description"]').fill('infinite event');
  await page.getByTestId('lego-editor-content').click();
  await page.keyboard.type('infinite event');
  await pickOption(page, 'eventType', 'Annet');
  await pickOption(page, 'eventStatusType', 'med påmelding');
  await page.locator('input[name="location"]').fill('EL6');
  await checkField(page, 'useConsent');
  await checkField(page, 'hasFeedbackQuestion');
  await page.locator('[name="feedbackDescription"]').fill('Burger eller sushi');
  await page.locator('[name="pools[0].name"]').fill('Mange');
  await pickOption(page, 'pools[0].permissionGroups', 'Abakus');
  await checkField(page, 'isClarified');

  await page.getByRole('button', { name: 'Opprett' }).click();
  await expect(page).not.toHaveURL(/\/events\/new/);

  const eventUrl = page.url();
  await gotoHydrated(page, eventUrl);
  await expect(
    page.getByRole('heading', { name: title, level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('EL6').first()).toBeVisible();
});

test('creates a priced event', async ({ page }) => {
  const title = `Priced event ${randomUUID().slice(0, 8)}`;

  await gotoHydrated(page, '/events/new');
  await uploadCover(page);

  await page.locator('input[name="title"]').fill(title);
  await page.locator('[name="description"]').fill('priced event');
  await page.getByTestId('lego-editor-content').click();
  await page.keyboard.type('priced event');
  await pickOption(page, 'eventType', 'Arrangement');
  await pickOption(page, 'eventStatusType', 'Vanlig');
  await page.locator('input[name="location"]').fill('R4');

  await page.getByText('Betalt arrangement').click();
  await expect(page.locator('[name="priceMember"]')).toBeVisible();
  await page.locator('[name="priceMember"]').fill('200');

  await page.locator('[name="pools[0].name"]').fill('WebkomPool');
  await page.locator('[name="pools[0].capacity"]').fill('20');
  await pickOption(page, 'pools[0].permissionGroups', 'Webkom');
  await checkField(page, 'isClarified');

  await page.getByRole('button', { name: 'Opprett' }).click();
  await expect(page).not.toHaveURL(/\/events\/new/);

  const eventUrl = page.url();
  await gotoHydrated(page, eventUrl);
  await expect(
    page.getByRole('heading', { name: title, level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('0/20')).toBeVisible();
  await expect(page.getByText('200,-')).toBeVisible();
  await expect(page.getByText('Betalingsfrist')).toBeVisible();
  await expect(page.getByText('R4').first()).toBeVisible();
});
