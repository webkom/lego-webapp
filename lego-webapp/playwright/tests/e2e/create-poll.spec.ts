import { randomUUID } from 'node:crypto';
import { test, expect, type Page } from '@playwright/test';
import { fieldError, gotoHydrated, selectFromDropdown } from '../../helpers';

const uniqueTitle = () => `Avstemning ${randomUUID().slice(0, 8)}`;

const createPoll = async (page: Page, title: string, options: string[]) => {
  await gotoHydrated(page, '/polls/new');
  await page.locator('input[name="title"]').fill(title);

  for (const [index, option] of options.entries()) {
    if (index > 1) {
      await page.getByRole('button', { name: 'Legg til alternativ' }).click();
    }
    await page.locator(`[name="options[${index}].name"]`).fill(option);
  }

  await page.getByRole('button', { name: 'Lag ny avstemning' }).click();
  await expect(page).not.toHaveURL(/\/polls\/new/);
};

const openPoll = async (page: Page, title: string) => {
  await gotoHydrated(page, '/polls');
  await page.getByText(title).click();
  await expect(page).toHaveURL(/\/polls\/\d+/);
  // Load the poll page directly; after a client-side navigation its vote
  // buttons are present but not yet wired up.
  await gotoHydrated(page, page.url());
};

test('requires a title and two options', async ({ page }) => {
  await gotoHydrated(page, '/polls/new');

  const submit = page.getByRole('button', { name: 'Lag ny avstemning' });
  await expect(submit).toBeDisabled();

  await page.locator('input[name="title"]').fill(uniqueTitle());
  await expect(submit).toBeEnabled();
  await submit.click();

  await expect(fieldError(page, 'options[0].name')).toBeVisible();
  await expect(fieldError(page, 'options[1].name')).toBeVisible();

  await page.locator('[name="options[0].name"]').fill('Choice A');
  await page.locator('[name="options[1].name"]').fill('Choice B');

  await expect(fieldError(page, 'options[0].name')).toHaveCount(0);
  await expect(fieldError(page, 'options[1].name')).toHaveCount(0);
});

test('creates a poll and it persists', async ({ page }) => {
  const title = uniqueTitle();

  await gotoHydrated(page, '/polls/new');
  await page.locator('input[name="title"]').fill(title);
  await page.locator('[name="options[0].name"]').fill('Choice A');
  await page.locator('[name="options[1].name"]').fill('Choice B');
  await page.getByRole('button', { name: 'Legg til alternativ' }).click();
  await page.locator('[name="options[2].name"]').fill('Choice C');
  await page.locator('[name="description"]').fill('this is a poll');
  await selectFromDropdown(page, 'tags', 'webkom');

  await page.getByRole('button', { name: 'Lag ny avstemning' }).click();
  await expect(page).not.toHaveURL(/\/polls\/new/);

  await openPoll(page, title);
  await expect(page.getByText('this is a poll')).toBeVisible();
  for (const choice of ['Choice A', 'Choice B', 'Choice C']) {
    await expect(page.getByText(choice)).toBeVisible();
  }
});

test('removes an option before submitting', async ({ page }) => {
  await gotoHydrated(page, '/polls/new');
  await page.locator('input[name="title"]').fill(uniqueTitle());
  await page.locator('[name="options[0].name"]').fill('Choice A');
  await page.locator('[name="options[1].name"]').fill('Choice B');

  await page.getByRole('button', { name: 'Legg til alternativ' }).click();
  await expect(page.locator('[name="options[2].name"]')).toBeVisible();

  await page.locator('[class*="deleteOption"]').last().click();
  await page.getByTestId('Modal__content').getByText('Ja').click();

  await expect(page.locator('[name="options[2].name"]')).toHaveCount(0);
});

test('answers a poll', async ({ page }) => {
  const title = uniqueTitle();
  await createPoll(page, title, ['Choice A', 'Choice B']);

  await openPoll(page, title);
  const pollUrl = page.url();

  await page.getByRole('button', { name: 'Choice A' }).click();

  await gotoHydrated(page, pollUrl);
  await expect(page.getByText('1 stemme', { exact: true })).toBeVisible();
});

test('deletes a poll', async ({ page }) => {
  const title = uniqueTitle();
  await createPoll(page, title, ['Choice A', 'Choice B']);

  await openPoll(page, title);
  await page.getByRole('button', { name: 'Rediger' }).click();
  await page.getByRole('button', { name: 'Slett avstemning' }).click();
  await page.getByTestId('Modal__content').getByText('Ja').click();

  await gotoHydrated(page, '/polls');
  await expect(page.getByText(title)).toHaveCount(0);
});
