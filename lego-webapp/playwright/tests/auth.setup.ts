import { test as setup, expect } from '@playwright/test';

const apiBaseUrl =
  process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://localhost:8000';
const authFile = 'playwright/.auth/webkom.json';

setup('authenticate as webkom', async ({ page, request, baseURL }) => {
  const response = await request.post(
    `${apiBaseUrl}/authorization/token-auth/`,
    { data: { username: 'webkom', password: 'Webkom123' } },
  );
  expect(response.ok()).toBeTruthy();

  const { token } = await response.json();
  await page
    .context()
    .addCookies([{ name: 'lego.auth', value: token, url: baseURL }]);
  await page.context().storageState({ path: authFile });
});
