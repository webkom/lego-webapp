import { randomUUID } from 'node:crypto';
import { test, expect, type Page } from '@playwright/test';
import { checkField, gotoHydrated, selectFromDropdown } from '../../helpers';

const COVER = 'playwright/fixtures/cover.png';

const editor = (page: Page) => page.getByTestId('lego-editor-content');
const toolbar = (page: Page) => page.getByTestId('lego-editor-toolbar');

test('formats text with the toolbar and keyboard shortcuts', async ({
  page,
}) => {
  await gotoHydrated(page, '/events/new');
  await editor(page).click();

  await expect(toolbar(page)).toBeVisible();

  // The formatting buttons carry no accessible name, so the heading button can
  // only be reached by position.
  await toolbar(page).getByRole('button').first().click();
  await page.keyboard.type('This text should be large');
  await expect(editor(page).locator('h1')).toHaveText(
    'This text should be large',
  );

  await page.keyboard.press('Enter');
  await page.keyboard.press('ControlOrMeta+b');
  await page.keyboard.type('This should be bold');
  await page.keyboard.press('ControlOrMeta+b');
  await page.keyboard.press('ControlOrMeta+i');
  await page.keyboard.type('This should be italic');
  await page.keyboard.press('ControlOrMeta+i');
  await page.keyboard.type('No format');

  await expect(editor(page).locator('strong')).toHaveText(
    'This should be bold',
  );
  await expect(editor(page).locator('em')).toHaveText('This should be italic');
  await expect(editor(page).locator('p').last()).toContainText('No format');
});

test('inserts an image into the text', async ({ page }) => {
  await gotoHydrated(page, '/events/new');
  await editor(page).click();

  await expect(editor(page).locator('img')).toHaveCount(0);

  await toolbar(page).getByRole('button', { name: 'Image' }).click();
  await expect(page.getByTestId('Modal__content')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Last opp' })).toBeDisabled();

  await page.locator('input[type="file"]').last().setInputFiles(COVER);
  await page.getByRole('button', { name: 'Last opp' }).click();

  await expect(page.getByTestId('Modal__content')).toHaveCount(0);
  await expect(editor(page).locator('img')).toHaveAttribute('src', /.+/);
});

test('keeps formatted text when the event is created', async ({ page }) => {
  const title = `Pils på Webkomkontoret ${randomUUID().slice(0, 8)}`;
  const heading = `Stor tekst ${randomUUID().slice(0, 8)}`;

  await gotoHydrated(page, '/events/new');

  await editor(page).click();
  await toolbar(page).getByRole('button').first().click();
  await page.keyboard.type(heading);
  await page.keyboard.press('Enter');
  await page.keyboard.type('EOF');

  await page.locator('input[type="file"]').first().setInputFiles(COVER);
  await page.getByRole('button', { name: 'Last opp' }).click();
  await expect(page.getByTestId('Modal__content')).toHaveCount(0);

  await page.locator('input[name="title"]').fill(title);
  await page.locator('[name="description"]').fill('blir fett');
  await selectFromDropdown(page, 'eventType', 'Sosialt');
  await page.locator('input[name="location"]').fill('DT');
  await checkField(page, 'isClarified');

  await page.getByRole('button', { name: 'Opprett' }).click();
  await expect(page).not.toHaveURL(/\/events\/new/);

  const eventUrl = page.url();
  await gotoHydrated(page, eventUrl);
  await expect(
    page.getByRole('heading', { name: title, level: 1 }),
  ).toBeVisible();
  await expect(page.getByText(heading)).toBeVisible();
  await expect(page.getByText('EOF')).toBeVisible();
});
