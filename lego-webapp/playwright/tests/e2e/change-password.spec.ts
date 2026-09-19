import { test, expect, type Page } from '@playwright/test';
import {
  canAuthenticate,
  fieldError,
  gotoHydrated,
  reauthenticate,
} from '../../helpers';

const SETTINGS = '/users/me/settings/profile';
const STRONG = 'Abakus123';
const WEAK = 'Testing123';

const openAdvanced = async (page: Page) => {
  await gotoHydrated(page, SETTINGS);
  await page.getByRole('heading', { name: 'Avansert', level: 2 }).click();
};

const submit = (page: Page) =>
  page.getByRole('button', { name: 'Endre passord' });

const changePassword = async (page: Page, current: string, next: string) => {
  await openAdvanced(page);
  await page.locator('input[name="password"]').fill(current);
  await page.locator('input[name="newPassword"]').fill(next);
  await page.locator('input[name="retypeNewPassword"]').fill(next);
  await expect(submit(page)).toBeEnabled();
  await submit(page).click();
  await expect(page).not.toHaveURL(/settings\/profile/);
};

test('rejects a weak or mismatched new password', async ({ page }) => {
  await openAdvanced(page);
  await expect(submit(page)).toBeDisabled();

  await page.locator('input[name="password"]').fill('Webkom123');
  await page.locator('input[name="password"]').blur();
  await expect(fieldError(page, 'newPassword')).toHaveCount(0);
  await expect(submit(page)).toBeDisabled();

  await page.locator('input[name="newPassword"]').fill(WEAK);
  await page.locator('input[name="newPassword"]').blur();
  await expect(fieldError(page, 'newPassword')).toContainText('for svakt');
  await expect(submit(page)).toBeDisabled();

  await page.locator('input[name="newPassword"]').fill(STRONG);
  await page.locator('input[name="retypeNewPassword"]').fill(WEAK);
  await page.locator('input[name="retypeNewPassword"]').blur();
  await expect(fieldError(page, 'retypeNewPassword')).toContainText(
    'ikke like',
  );
  await expect(submit(page)).toBeDisabled();
});

test('rejects a wrong current password', async ({ page }) => {
  await openAdvanced(page);

  await page.locator('input[name="password"]').fill('this is not my password');
  await page.locator('input[name="newPassword"]').fill(STRONG);
  await page.locator('input[name="retypeNewPassword"]').fill(STRONG);
  await expect(submit(page)).toBeEnabled();
  await submit(page).click();

  await expect(fieldError(page, 'password')).toContainText('Invalid password');
  await expect(page).toHaveURL(/settings\/profile/);
});

test.describe('as test2', () => {
  test.use({ storageState: 'playwright/.auth/test2.json' });

  test('changes the password', async ({ page, request, baseURL }) => {
    await changePassword(page, 'Webkom123', STRONG);

    expect(await canAuthenticate(request, 'test2', STRONG)).toBe(true);
    expect(await canAuthenticate(request, 'test2', 'Webkom123')).toBe(false);

    // A password change invalidates the session, so re-authenticate before
    // restoring the fixture password for the next run.
    await reauthenticate(page, request, 'test2', STRONG, baseURL!);
    await changePassword(page, STRONG, 'Webkom123');
    expect(await canAuthenticate(request, 'test2', 'Webkom123')).toBe(true);
  });
});
