import { test, expect, type Page } from '@playwright/test';
import { gotoHydrated } from '../../helpers';

/**
 * These tests talk to the real Stripe API and are skipped unless ENABLE_STRIPE
 * is set, matching the behaviour of the Cypress spec they replace. Running them
 * needs a Stripe test key on the backend; use a personal one, since the shared
 * key delivers webhooks to staging.
 */
test.skip(
  !process.env.ENABLE_STRIPE,
  'Set ENABLE_STRIPE to run the Stripe payment tests',
);

const PAID_EVENT = '/events/54';

// Test cards: https://stripe.com/docs/testing
const CARD = {
  requires3ds: '4000 0025 0000 3155',
  invalidCvc: '4000 0000 0000 0127',
  expired: '4242 4242 4242 4242',
  insufficientFunds: '4000 0000 0000 9995',
  authenticates: '4000 0000 0000 3220',
  authenticationFails: '4000 0000 0000 3063',
  alwaysAuthenticate: '4000 0027 6000 3184',
  amex: '3782 8224 6310 005',
};

const cardInput = (page: Page, testId: string, name: string) =>
  page
    .getByTestId(testId)
    .frameLocator('iframe')
    .locator(`input[name="${name}"]`);

const fillCardDetails = async (
  page: Page,
  cardNumber: string,
  expiry: string,
  cvc: string,
) => {
  await cardInput(page, 'cardnumber-input', 'cardnumber').fill(cardNumber);
  await cardInput(page, 'expiry-input', 'exp-date').fill(expiry);
  await cardInput(page, 'cvc-input', 'cvc').fill(cvc);
};

const clearCardDetails = async (page: Page) => {
  await cardInput(page, 'cardnumber-input', 'cardnumber').clear();
  await cardInput(page, 'expiry-input', 'exp-date').clear();
  await cardInput(page, 'cvc-input', 'cvc').clear();
};

const confirm3DSecure = async (page: Page, confirm = true) => {
  await page
    .frameLocator('iframe[name^="__privateStripeFrame"]')
    .frameLocator('iframe#challengeFrame')
    .locator(confirm ? '#test-source-authorize-3ds' : '#test-source-fail-3ds')
    .click();
};

const stripeError = (page: Page) =>
  page.getByTestId('stripe').locator('[class*="_error"]');

const register = async (page: Page) => {
  await gotoHydrated(page, PAID_EVENT);
  await page.getByRole('button', { name: 'Meld deg på' }).click();
};

test('registers for a paid event and pays', async ({ page }) => {
  await register(page);

  await expect(page.getByText('er påmeldt')).toBeVisible();
  await expect(page.getByText('Du skal betale 270,00')).toBeVisible();

  await fillCardDetails(page, CARD.requires3ds, '0230', '123');
  await page.getByRole('button', { name: 'Betal' }).click();
  await confirm3DSecure(page);

  await expect(page.getByText('Du har betalt')).toBeVisible();

  // The payment must survive a reload, not just update the view.
  await gotoHydrated(page, PAID_EVENT);
  await expect(page.getByText('Du har betalt')).toBeVisible();
});

test('reports card errors from Stripe', async ({ page }) => {
  await register(page);

  await fillCardDetails(page, CARD.invalidCvc, '0230', '123');
  await page.getByRole('button', { name: 'Betal' }).click();
  await expect(stripeError(page)).toContainText(
    /Kortets CVC-nummer er feil|security code is incorrect/,
  );
  await clearCardDetails(page);

  await fillCardDetails(page, CARD.expired, '0210', '123');
  await page.getByRole('button', { name: 'Betal' }).click();
  await expect(stripeError(page)).toContainText(
    /Kortets utløpsår er i fortiden|expiration year is in the past/,
  );
  await clearCardDetails(page);

  await fillCardDetails(page, CARD.insufficientFunds, '0230', '123');
  await page.getByRole('button', { name: 'Betal' }).click();
  await expect(stripeError(page)).toContainText(
    /ikke nok midler|insufficient funds/,
  );
});

test('pays with a 3D Secure 2 card', async ({ page }) => {
  await register(page);

  await fillCardDetails(page, CARD.authenticates, '0230', '123');
  await page.getByRole('button', { name: 'Betal' }).click();
  await confirm3DSecure(page);

  await expect(page.getByText('Du har betalt')).toBeVisible();
});

test('recovers after a declined authentication', async ({ page }) => {
  await register(page);

  await fillCardDetails(page, CARD.authenticationFails, '0230', '123');
  await page.getByRole('button', { name: 'Betal' }).click();
  await confirm3DSecure(page, false);

  await expect(stripeError(page)).toContainText(
    /kan ikke autentisere betalingsmåten din|unable to authenticate your payment method/,
  );

  await clearCardDetails(page);
  await fillCardDetails(page, CARD.alwaysAuthenticate, '0230', '123');
  await page.getByRole('button', { name: 'Betal' }).click();
  await confirm3DSecure(page);

  await expect(page.getByText('Du har betalt')).toBeVisible();
});

test('pays after an interrupted confirmation', async ({ page }) => {
  await register(page);

  // Swallow the first confirmation so the browser never learns the outcome,
  // simulating the user closing the tab mid-payment.
  await page.route('https://api.stripe.com/**/confirm', async (route) => {
    await page.unroute('https://api.stripe.com/**/confirm');
    await route.fulfill({ status: 200, body: 'success' });
  });

  await fillCardDetails(page, CARD.amex, '0230', '123');
  await page.getByRole('button', { name: 'Betal' }).click();

  await gotoHydrated(page, PAID_EVENT);
  await fillCardDetails(page, CARD.amex, '0230', '123');
  await page.getByRole('button', { name: 'Betal' }).click();

  await expect(page.getByText('Du har betalt')).toBeVisible();
});
