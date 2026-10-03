import { test as setup, expect, type Page } from '@playwright/test';

const apiBaseUrl =
  process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://localhost:8000';

const authenticate = async (
  page: Page,
  baseURL: string | undefined,
  request: Page['request'],
  username: string,
  password: string,
) => {
  const response = await request.post(
    `${apiBaseUrl}/authorization/token-auth/`,
    { data: { username, password } },
  );
  expect(response.ok()).toBeTruthy();

  const { token } = await response.json();
  await page
    .context()
    .addCookies([{ name: 'lego.auth', value: token, url: baseURL }]);
  await page
    .context()
    .storageState({ path: `playwright/.auth/${username}.json` });
};

setup('authenticate as webkom', async ({ page, request, baseURL }) => {
  await authenticate(page, baseURL, request, 'webkom', 'Webkom123');
});

setup('authenticate as test2', async ({ page, request, baseURL }) => {
  await authenticate(page, baseURL, request, 'test2', 'Webkom123');
});
