import {
  field,
  fieldError,
  selectField,
  selectEditor,
  fillCardDetails,
  confirm3DSecureDialog,
  confirm3DSecure2Dialog,
  stripeError,
  clearCardDetails,
  uploadHeader,
  NO_OPTIONS_MESSAGE,
} from '../support/utils.js';

describe('Event registration & payment', () => {
  if (Cypress.env('ENABLE_STRIPE')) {
    beforeEach(() => {
      cy.resetDb();
      cy.cachedLogin();
    });

    Cypress.on('uncaught:exception', () => {
      return false;
    });

    it('Should be possible to create a priced event', () => {
      cy.visit('/events/create');
      uploadHeader();

      // Set title, description and text
      field('title').type('Priced event').blur();
      field('description').type('priced event').blur();
      selectEditor().type('priced event');

      // Select type
      selectField('eventType').click();
      cy.focused().type('Arran{enter}', { force: true });

      // Select regitrationType
      selectField('eventStatusType').click();
      cy.focused().type('Vanlig{enter}', { force: true });

      // Set location
      field('useMazemap').uncheck();
      cy.contains('Sted').click();
      cy.focused().type('R4');

      // Set event to priced
      cy.contains('Betalt arrangement').click();
      // You need to touch the field before the errors pop up
      cy.contains('Pris (medlem)').should('be.visible').click();

      // FIXME: You need to click outside the payment "sub-form" to show
      // field errors.
      cy.contains('Samtykke til bilder').click().click();
      fieldError('priceMember').should('be.visible');
      cy.contains('Summen må være større').should('be.visible');

      cy.contains('systemgebyr').should('exist').click();

      cy.contains('Pris (medlem)').click();
      // TODO Make form clear if value is invalid (0 or non-numeneric)
      cy.focused().type('{moveToEnd}{backspace}200');

      // Set the first pool
      field('pools[0].name').clear().type('WebkomPool').blur();
      field('pools[0].capacity').type('20').blur();
      selectField('pools[0].permissionGroups').click();
      cy.focused().type('Webkom', { force: true });
      selectField('pools[0].permissionGroups')
        .find('[id=react-select-pools\\[0\\]\\.permissionGroups-listbox]')
        .should('not.contain', NO_OPTIONS_MESSAGE)
        .and('contain', 'Webkom');
      cy.focused().type('{enter}', { force: true });

      cy.contains('button', 'Opprett').should('not.be.disabled').click();

      // Verify that created event looks good..
      cy.url().should('not.contain', '/events/create');
      cy.url().should('contain', '/events/');
      cy.contains('0/20').should('be.visible');
      cy.contains('Arrangement').should('be.visible');
      cy.contains('webkom webkom').should('be.visible');
      cy.contains('WebkomPool').should('be.visible');
      cy.contains('R4').should('be.visible');
      cy.contains('Påmelding åpner').should('be.visible');
      cy.contains('Dette er et betalt arrangement').should('be.visible');
      cy.contains('205,-').should('be.visible');
    });

    it('Should be possible to register to a paid event and pay', () => {
      cy.visit('localhost:3000/events/54');
      cy.intercept('https://js.stripe.com/v*/elements*').as('stripeJs');

      cy.contains('button', 'Meld deg på')
        .should('exist.and.not.be.disabled')
        .click();

      cy.contains('Du er påmeldt');
      cy.contains('Du skal betale 270,00');

      cy.wait(['@stripeJs', '@stripeJs', '@stripeJs']);

      // This card requires 3D secure
      fillCardDetails('4000 0025 0000 3155', '0230', '123');
      cy.contains('button', 'Betal').click();

      cy.intercept('https://hooks.stripe.com/redirect/authenticate/*').as(
        'stripeHook'
      );
      cy.wait('@stripeHook');
      confirm3DSecureDialog();

      cy.contains('Du har betalt').should('be.visible');

      // Make sure the successful payment is stored in the db
      cy.reload();
      cy.contains('Du har betalt').should('be.visible');
    });

    it('Should give appropriate errors when attempting to pay', () => {
      cy.visit('localhost:3000/events/54');

      cy.intercept('https://js.stripe.com/v*/elements*').as('stripeJs');

      cy.contains('button', 'Meld deg på')
        .should('exist.and.not.be.disabled')
        .click();

      cy.wait(['@stripeJs', '@stripeJs', '@stripeJs']);

      /**
       * See https://stripe.com/docs/testing for the different test cards.
       */

      // Invalid cvc
      fillCardDetails('4000 0000 0000 0101', '0230', '123');
      cy.contains('button', 'Betal').click();
      stripeError()
        // The first one may take some time (due to calls to stripe API)
        .contains(
          /(sikkerhetskode er ikke korrekt)|(security code is incorrect)/,
          { timeout: 8000 }
        )
        .should('be.visible');
      clearCardDetails();

      // Invalid expiry
      fillCardDetails('4242 4242 4242 4242', '0210', '123');
      cy.contains('button', 'Betal').click();
      stripeError()
        .contains(
          /(Kortets utløpsår er passert)|(Your card's expiration year is in the past)/
        )
        .should('be.visible');
      clearCardDetails();

      // Insufficient funds
      fillCardDetails('4000 0000 0000 9995', '0230', '123');
      cy.contains('button', 'Betal').click();
      stripeError()
        .contains(/(ikke nok penger)|(card has insufficient funds)/)
        .should('be.visible');

      //
    });

    it('Should be possible to pay with a 3D secure 2 card', () => {
      cy.visit('localhost:3000/events/54');

      cy.intercept('https://js.stripe.com/v*/elements*').as('stripeJs');

      cy.contains('button', 'Meld deg på')
        .should('exist.and.not.be.disabled')
        .click();
      cy.wait(['@stripeJs', '@stripeJs', '@stripeJs']);

      /**
       * Test cases defined here: https://stripe.com/docs/testing#regulatory-cards
       */

      fillCardDetails('4000 0000 0000 3220', '0230', '123');
      cy.contains('button', 'Betal').click();

      cy.intercept('https://js.stripe.com/v3/three-ds-2-challenge*').as(
        'stripe3ds'
      );
      cy.wait('@stripe3ds');
      confirm3DSecure2Dialog();
      cy.contains('Du har betalt').should('be.visible');
    });

    it('Should be possible to cancel a confirmation and pay with another card', () => {
      cy.visit('localhost:3000/events/54');
      cy.intercept('https://js.stripe.com/v*/elements*').as('stripeJs');

      cy.contains('button', 'Meld deg på')
        .should('exist.and.not.be.disabled')
        .click();
      cy.wait(['@stripeJs', '@stripeJs', '@stripeJs']);

      fillCardDetails('4000 0000 0000 3063', '0230', '123');
      cy.contains('button', 'Betal').click();

      cy.intercept('https://hooks.stripe.com/redirect/authenticate/*').as(
        'stripeHook'
      );
      cy.wait('@stripeHook');
      confirm3DSecureDialog(false);
      stripeError()
        .contains(
          /(Vi kan ikke verifisere betalingsmåten din)|(We are unable to authenticate your payment method)/
        )
        .should('be.visible');

      clearCardDetails();
      fillCardDetails('4000 0027 6000 3184', '0230', '123');
      cy.contains('button', 'Betal').click();

      cy.intercept('https://hooks.stripe.com/redirect/authenticate/*').as(
        'stripeHook'
      );
      cy.wait('@stripeHook');
      confirm3DSecureDialog();

      cy.contains('Du har betalt').should('be.visible');
    });

    it('Should be possible to pay with interruptions in the middle', () => {
      cy.visit('localhost:3000/events/54');
      cy.intercept('https://js.stripe.com/v*/elements*').as('stripeJs');

      cy.contains('button', 'Meld deg på')
        .should('exist.and.not.be.disabled')
        .click();
      cy.wait(['@stripeJs', '@stripeJs', '@stripeJs']);

      // Intercept payment confirmation and act like it was successful
      cy.intercept(
        { method: 'POST', url: 'https://api.stripe.com/**/confirm', times: 1 },
        {
          statusCode: 200,
          body: 'success',
        }
      ).as('confirm');

      fillCardDetails('3782 8224 6310 005', '0230', '123');
      cy.contains('button', 'Betal').click();

      cy.wait('@confirm');
      cy.reload();
      cy.cachedLogin();
      cy.intercept('https://js.stripe.com/v*/elements*').as('stripeJs');

      cy.wait(['@stripeJs', '@stripeJs', '@stripeJs']);
      fillCardDetails('3782 8224 6310 005', '0230', '123');
      cy.contains('button', 'Betal').click();

      cy.contains('Du har betalt').should('be.visible');
    });
  } else {
    // eslint-disable-next-line
    it('Skipping stripe tests (set env ENABLE_STRIPE to run)', () => {});
  }
});
