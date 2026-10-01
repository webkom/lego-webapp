import { expect, type APIRequestContext, type Page } from '@playwright/test';

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

const apiBaseUrl =
  process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://localhost:8000';

export const canAuthenticate = async (
  request: APIRequestContext,
  username: string,
  password: string,
) => {
  const response = await request.post(
    `${apiBaseUrl}/authorization/token-auth/`,
    { data: { username, password }, failOnStatusCode: false },
  );
  return response.ok();
};

export const reauthenticate = async (
  page: Page,
  request: APIRequestContext,
  username: string,
  password: string,
  baseURL: string | undefined,
) => {
  const response = await request.post(
    `${apiBaseUrl}/authorization/token-auth/`,
    { data: { username, password } },
  );
  const { token } = await response.json();
  await page.context().clearCookies();
  await page
    .context()
    .addCookies([{ name: 'lego.auth', value: token, url: baseURL }]);
};
