import { randomUUID } from 'node:crypto';
import { test, expect } from '@playwright/test';
import { gotoHydrated } from '../../helpers';

const EVENT_WITH_FEEDBACK = '/events/20';
const EVENT_WITHOUT_FEEDBACK = '/events/19';

test('shows event details and the attendance modal', async ({ page }) => {
  await gotoHydrated(page, EVENT_WITH_FEEDBACK);

  await expect(page.getByTestId('page-cover').locator('img')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Eksamenskurs i Java', level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Avregistrer' })).toBeVisible();

  await page
    .getByTestId('attendance-box')
    .getByRole('button', { name: '9/15' })
    .click();

  await expect(page.getByTestId('Modal__content')).toBeVisible();
  await expect(
    page.getByTestId('attendance-modal-content').locator('li'),
  ).toHaveCount(9);

  await page.keyboard.press('Escape');
  await expect(page.getByTestId('Modal__content')).toBeHidden();
});

test('offers feedback only on events that require it', async ({ page }) => {
  await gotoHydrated(page, EVENT_WITHOUT_FEEDBACK);
  await expect(page.locator('#feedback')).toHaveCount(0);

  await gotoHydrated(page, EVENT_WITH_FEEDBACK);
  await expect(page.getByRole('button', { name: 'Oppdater' })).toBeDisabled();

  const feedback = `noe lættis ${randomUUID().slice(0, 8)}`;
  await page.locator('#feedback').fill(feedback);

  const update = page.getByRole('button', { name: 'Oppdater' });
  await expect(update).toBeEnabled();
  await update.click();

  await expect(page.getByText('Tilbakemelding oppdatert')).toBeVisible();

  await gotoHydrated(page, EVENT_WITH_FEEDBACK);
  await expect(page.locator('#feedback')).toHaveValue(feedback);
});

test('posts a comment and deletes it', async ({ page }) => {
  const comment = `This event will be awesome ${randomUUID().slice(0, 8)}`;

  await gotoHydrated(page, EVENT_WITH_FEEDBACK);

  await page.getByTestId('comment-form').locator('input').first().fill(comment);
  const submit = page.getByRole('button', { name: 'Kommenter' });
  await expect(submit).toBeEnabled();
  await submit.click();

  await expect(page.getByText(comment)).toBeVisible();

  const posted = page
    .getByText(comment)
    .locator('xpath=ancestor::*[contains(@class,"_comment")][1]');
  await posted.getByTestId('delete-comment-button').click();

  await expect(page.getByText(comment)).toHaveCount(0);
});

test.fixme('replies to a comment', async ({ page }) => {
  const parent = `Top comment ${randomUUID().slice(0, 8)}`;
  const child = `Child comment ${randomUUID().slice(0, 8)}`;

  await gotoHydrated(page, EVENT_WITH_FEEDBACK);

  await page.getByTestId('comment-form').locator('input').first().fill(parent);
  const submit = page.getByRole('button', { name: 'Kommenter' });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.getByText(parent)).toBeVisible();

  const posted = page
    .getByText(parent)
    .locator('xpath=ancestor::*[contains(@class,"_comment")][1]');
  await posted.getByRole('button', { name: 'Svar' }).click();

  await page.getByTestId('comment-form').locator('input').last().fill(child);
  await page.getByRole('button', { name: 'Send svar' }).click();

  await expect(
    page.locator('[class*="_nested"]').getByText(child),
  ).toBeVisible();

  await posted.getByTestId('delete-comment-button').first().click();
});
