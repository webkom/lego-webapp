import { test, expect, type Page } from '@playwright/test';
import { gotoHydrated, openAccountMenu } from '../../helpers';

test.describe('navbar', () => {
  test('navigates to events', async ({ page }) => {
    await gotoHydrated(page, '/');
    await page
      .getByRole('banner')
      .getByRole('link', { name: 'Arrangementer' })
      .click();

    await expect(page).toHaveURL(/\/events/);
    await expect(page.getByText('Denne uken')).toBeVisible();
    await expect(page.getByText('Oversikt')).toBeVisible();
  });

  test('navigates to joblistings', async ({ page }) => {
    await gotoHydrated(page, '/');
    await page
      .getByRole('banner')
      .getByRole('link', { name: 'Karriere' })
      .click();

    await expect(page).toHaveURL(/\/joblistings/);
    await expect(page.getByText('Jobbannonser')).toBeVisible();
  });

  test('navigates to the about page', async ({ page }) => {
    await gotoHydrated(page, '/');
    await page
      .getByRole('banner')
      .getByRole('link', { name: 'Om Abakus' })
      .click();

    await expect(page).toHaveURL(/\/pages\/info-om-abakus/);
    await expect(page.getByText('Generelt')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Komiteer' })).toBeVisible();
  });
});

test.describe('account menu', () => {
  test('navigates to the profile and on to settings', async ({ page }) => {
    await gotoHydrated(page, '/');
    await openAccountMenu(page);
    await page.getByRole('link', { name: 'webkom', exact: true }).click();

    await expect(page).toHaveURL(/\/users\/me/);
    await expect(page.getByText('Brukerinfo')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Prikker', level: 3 }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Innstillinger' }).click();
    await expect(
      page.getByRole('heading', { name: 'Innstillinger', level: 1 }),
    ).toBeVisible();
  });

  test('navigates between settings tabs', async ({ page }) => {
    await gotoHydrated(page, '/');
    await openAccountMenu(page);
    await page.getByRole('link', { name: 'Innstillinger' }).click();

    await expect(page).toHaveURL(/\/users\/me\/settings/);
    await expect(
      page.getByRole('heading', { name: 'Innstillinger', level: 1 }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Notifikasjoner' }).click();
    await expect(page).toHaveURL(/\/users\/me\/settings\/notifications/);
    await expect(
      page.getByRole('cell', { name: 'E-poster som sendes direkte til deg' }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'OAuth2' }).click();
    await expect(page).toHaveURL(/\/users\/me\/settings\/oauth2/);
    await expect(
      page.getByText('Denne nettsiden benytter seg av et API'),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Verifiser studentstatus' }).click();
    await expect(page).toHaveURL(/\/users\/me\/settings\/student-confirmation/);
  });

  test('navigates to meetings and the new meeting form', async ({ page }) => {
    await gotoHydrated(page, '/');
    await openAccountMenu(page);
    await page.getByRole('link', { name: 'Møteinnkallinger' }).click();

    await expect(page).toHaveURL(/\/meetings/);
    await expect(page.getByText('Dine møter')).toBeVisible();

    await page.getByRole('link', { name: 'Nytt møte' }).click();
    await expect(page).toHaveURL(/\/meetings\/new/);
    await expect(page.getByText('Tittel')).toBeVisible();
  });

  test('logs out', async ({ page }) => {
    await gotoHydrated(page, '/');
    await openAccountMenu(page);
    await page.getByRole('button', { name: 'Logg ut' }).click();

    await expect(
      page.getByRole('heading', { name: 'Velkommen til Abakus', level: 1 }),
    ).toBeVisible();
  });
});

// Just to check if the routes exists
test.describe('direct routes', () => {
  const routes = [
    { path: '/events/interest', heading: 'Interessegrupper' },
    { path: '/interest-groups/9075', heading: 'Abafilm' },
    { path: '/lending', heading: 'Utlån' },
    { path: '/lending/admin', heading: 'Utlån - Admin' },
    { path: '/polls', heading: 'Avstemninger' },
    { path: '/events/calendar', heading: 'Arrangementer' },
  ];

  for (const { path, heading } of routes) {
    test(`renders ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(
        page.getByRole('heading', { name: heading, level: 1 }),
      ).toBeVisible();
    });
  }
});

test.describe('extended menu', () => {
  const DESTINATIONS = [
    { name: 'Arrangementer', href: '/events' },
    { name: 'Artikler', href: '/articles' },
    { name: 'Avstemninger', href: '/polls' },
    { name: 'Bedrifter', href: '/companies' },
    { name: 'Album', href: '/photos' },
    { name: 'Interessegrupper', href: '/events/interest' },
    { name: 'Jobbannonser', href: '/joblistings' },
    { name: 'Kontakt Abakus', href: '/contact' },
    { name: 'Møter', href: '/meetings' },
    { name: 'Om Abakus', href: '/pages/info-om-abakus' },
    { name: 'Overhørt', href: '/quotes/' },
  ];

  // The search overlay has no landmark role, so anchor on its "Sider" heading.
  const quickLinks = (page: Page) =>
    page
      .getByRole('heading', { name: 'Sider', level: 2 })
      .locator('xpath=following-sibling::div[1]');

  test('opens and closes the extended menu', async ({ page }) => {
    await gotoHydrated(page, '/');

    await page.getByTestId('search-menu-icon').click();
    await expect(quickLinks(page)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Sider', level: 2 }),
    ).toBeVisible();

    await page.getByTestId('search-menu-icon').click();
    await expect(quickLinks(page)).toBeHidden();
    await expect(
      page.getByRole('heading', { name: 'Påmeldinger', level: 3 }),
    ).toBeVisible();
  });

  test('links to every destination', async ({ page }) => {
    await gotoHydrated(page, '/');
    await page.getByTestId('search-menu-icon').click();

    for (const { name, href } of DESTINATIONS) {
      await expect(
        quickLinks(page).getByRole('link', { name }),
      ).toHaveAttribute('href', href);
    }
  });

  test('navigates from the extended menu', async ({ page }) => {
    await gotoHydrated(page, '/');

    for (const { name, href } of DESTINATIONS) {
      await page.getByTestId('search-menu-icon').click();
      await quickLinks(page).getByRole('link', { name }).click();
      await expect(page).toHaveURL(new RegExp(href.replace(/\//g, '\\/')));
    }
  });
});
