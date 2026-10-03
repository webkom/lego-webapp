import { randomUUID } from 'node:crypto';
import { test, expect, type Page } from '@playwright/test';
import {
  checkField,
  fieldError,
  gotoHydrated,
  selectFromDropdown,
} from '../../helpers';

const uniqueContact = () => `webkom ${randomUUID().slice(0, 8)}`;

const fillCompanyInterest = async (page: Page, contactPerson: string) => {
  await selectFromDropdown(page, 'company', 'BEKK');
  await page.locator('[name="contactPerson"]').fill(contactPerson);
  await page.locator('[name="mail"]').fill('webkom@webkom.no');
  await page.locator('[name="phone"]').fill('90909090');
  await page
    .locator('[name="officeInTrondheim"]')
    .locator('xpath=..')
    .getByRole('button')
    .click();
  await checkField(page, 'semesters[0].checked');
  await checkField(page, 'events[0].checked');
  await checkField(page, 'otherOffers[0].checked');
  await page
    .locator('[name="companyPresentationComment"]')
    .fill('some pitch for presentation');
  const companyType = page.locator('[name="companyType"]').first();
  await companyType.scrollIntoViewIfNeeded();
  await companyType.check({ force: true });
  await page.locator('[name="comment"]').fill('random comment');
};

test.describe('as a visitor', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('creates a company interest', async ({ page }) => {
    await gotoHydrated(page, '/interesse');
    await fillCompanyInterest(page, uniqueContact());
    await page.getByRole('button', { name: 'Send bedriftsinteresse' }).click();

    await expect(page).toHaveURL(/\/pages\/bedrifter\/for-bedrifter/);
    await expect(page.getByText('Bedriftsinteresse opprettet')).toBeVisible();
  });

  test('rejects an interest with invalid input', async ({ page }) => {
    await gotoHydrated(page, '/interesse');
    await selectFromDropdown(page, 'company', 'BEKK');
    await page.locator('[name="contactPerson"]').fill('webkom');
    await page.locator('[name="mail"]').fill('webkom@webko');
    await page.locator('[name="comment"]').fill('random comment');

    await page.getByRole('button', { name: 'Send bedriftsinteresse' }).click();

    await expect(fieldError(page, 'phone')).toBeVisible();
    await expect(page).toHaveURL(/\/interesse/);
  });

  test('keeps filled fields when switching language', async ({ page }) => {
    await gotoHydrated(page, '/interesse');

    await page.locator('[name="contactPerson"]').fill('webkom');
    await checkField(page, 'semesters[0].checked');

    await page.getByRole('button', { name: 'English' }).click();
    await expect(page).toHaveURL(/lang=en/);
    await expect(
      page.getByRole('button', { name: 'Submit interest' }),
    ).toBeVisible();
    await expect(page.locator('[name="contactPerson"]')).toHaveValue('webkom');
    await expect(page.locator('[name="semesters[0].checked"]')).toBeChecked();

    await page.getByRole('button', { name: 'Norsk' }).click();
    await expect(page).not.toHaveURL(/lang=en/);
    await expect(page.locator('[name="contactPerson"]')).toHaveValue('webkom');
  });
});

test.describe('as an admin', () => {
  test('creates an interest that appears in the admin list', async ({
    page,
  }) => {
    const contactPerson = uniqueContact();

    await gotoHydrated(page, '/interesse');
    await fillCompanyInterest(page, contactPerson);
    await page.getByRole('button', { name: 'Send bedriftsinteresse' }).click();

    await expect(page).toHaveURL(/\/bdb\/company-interest/);

    const row = page.getByRole('row').filter({ hasText: contactPerson });
    await expect(row).toContainText('BEKK');
    await expect(row).toContainText('webkom@webkom.no');

    await gotoHydrated(page, '/bdb/company-interest');
    await expect(
      page.getByRole('row').filter({ hasText: contactPerson }),
    ).toBeVisible();
  });
});
