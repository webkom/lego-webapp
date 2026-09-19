import { expect, type Page } from '@playwright/test';

export const gotoHydrated = async (page: Page, path: string) => {
  await page.goto(path);
  await page.locator('body[data-hydrated="true"]').waitFor();
};

export const openAccountMenu = async (page: Page) => {
  await page
    .getByRole('banner')
    .getByRole('img', { name: 'webkom sitt profilbilde' })
    .click();
};

export const selectFromDropdown = async (
  page: Page,
  field: string,
  value: string,
) => {
  const input = page.locator(`#react-select-${field}-input`);
  await input.fill(value);
  await expect(page.locator(`#react-select-${field}-listbox`)).toContainText(
    value,
  );
  await input.press('Enter');
};

export const fieldError = (page: Page, field: string) =>
  page.locator(`[data-error-field-name="${field}"]`);

export const checkField = async (page: Page, name: string) => {
  const field = page.locator(`[name="${name}"]`);
  await field.scrollIntoViewIfNeeded();
  await field.check({ force: true });
};
