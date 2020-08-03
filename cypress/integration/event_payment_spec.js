import {
  c,
  field,
  fieldError,
  selectField,
  selectEditor,
  fillCardDetails,
  confirm3DSecureDialog,
  confirm3DSecure2Dialog,
  stripeError,
  clearCardDetails,
} from '../support/utils.js';

describe('Event registration & payment', () => {
  if (Cypress.env('ENABLE_STRIPE')) {
    beforeEach(() => {
      cy.resetDb();
      cy.cachedLogin();
    });

    const uploadHeader = () => {
      // Upload file
      cy.upload_file(
        c('ImageUploadField__coverImage') + ' ' + c('UploadImage__dropArea'),
        'images/screenshot.png'
      );
      cy.get('.cropper-move').click();
      cy.get(c('Modal__content'))
        .contains('Last opp')
        .should('not.be.disabled')
        .click();
    };

    it('Should be possible to create a priced event', () => {
      cy.visit('/events/create');
      uploadHeader();

      // Set title, description and text
      field('title').type('Priced event').blur();
      field('description').type('priced event').blur();
      selectEditor().editorType('priced event');

      // Select type
      selectField('eventType').click();
      cy.focused().type('Arran{enter}', { force: true });

      // Select regitrationType
      selectField('eventStatusType').click();
      cy.focused().type('Vanlig{enter}', { force: true });

      // Set location
      cy.contains('Sted').click();
      cy.focused().type('R4');

      // Set event to priced
      cy.contains('Betalt arrangement').click();
      // You need to touch the field before the errors pop up
      cy.contains('Pris medlem').should('be.visible').click();

      // FIXME: You need to click outside the payment "sub-form" to show
      // field errors.
      cy.contains('Samtykke til bilder').click().click();
      fieldError('priceMember').should('be.visible');
      cy.contains('Summen må være større').should('be.visible');

      cy.contains('systemgebyr').should('exist').click();

      cy.contains('Pris medlem').click();
      // TODO Make form clear if value is invalid (0 or non-numeneric)
      cy.focused().type('{moveToEnd}{backspace}200');

      // Set the first pool
      field('pools[0].name').clear().type('WebkomPool').blur();
      field('pools[0].capacity').type('20').blur();
      selectField('pools[0].permissionGroups').click();
      cy.focused().type('Webkom', { force: true });
      selectField('pools[0].permissionGroups')
        .find('.Select-menu-outer')
        .should('not.contain', 'No results')
        .and('contain', 'Webkom');
      cy.focused().type('{enter}', { force: true });

      cy.contains('button', 'OPPRETT').should('not.be.disabled').click();

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

      cy.contains('button', 'Meld deg på')
        .should('exist.and.not.be.disabled')
        .click();

      cy.wait(500);

      cy.contains('Du er påmeldt');
      cy.contains('Du skal betale 270,00');

      cy.wait(1000);

      // This card requires 3D secure
      fillCardDetails('4000 0025 0000 3155', '0230', '123');
      cy.contains('button', 'Betal').click();

      cy.wait(6000);
      confirm3DSecureDialog();

      cy.contains('Du har betalt').should('be.visible');

      // Make sure the successful payment is stored in the db
      cy.reload();
      cy.contains('Du har betalt').should('be.visible');
    });

    it('Should give appropriate errors when attempting to pay', () => {
      cy.visit('localhost:3000/events/54');

      cy.contains('button', 'Meld deg på')
        .should('exist.and.not.be.disabled')
        .click();
      cy.wait(1000);

      /**
       * See https://stripe.com/docs/testing for the different test cards.
       */

      // Invalid cvc
      fillCardDetails('4000 0000 0000 0101', '0230', '123');
      cy.contains('button', 'Betal').click();
      stripeError()
        // The first one may take some time (due to calls to stripe API)
        .contains('sikkerhetskode er ikke korrekt', { timeout: 8000 })
        .should('be.visible');
      clearCardDetails();

      // Invalid expiry
      fillCardDetails('4242 4242 4242 4242', '0210', '123');
      cy.contains('button', 'Betal').click();
      stripeError()
        .contains('Kortets utløpsår er passert')
        .should('be.visible');
      clearCardDetails();

      // Insufficient funds
      fillCardDetails('4000 0000 0000 9995', '0230', '123');
      cy.contains('button', 'Betal').click();
      stripeError().contains('ikke nok penger').should('be.visible');

      //
    });

    it('Should be possible to pay with a 3D secure 2 card', () => {
      cy.visit('localhost:3000/events/54');

      cy.contains('button', 'Meld deg på')
        .should('exist.and.not.be.disabled')
        .click();
      cy.wait(1000);

      /**
       * Test cases defined here: https://stripe.com/docs/testing#regulatory-cards
       */

      fillCardDetails('4000 0000 0000 3220', '0230', '123');
      cy.contains('button', 'Betal').click();

      cy.wait(6000);
      confirm3DSecure2Dialog();
      cy.contains('Du har betalt').should('be.visible');
    });

    it('Should be possible to cancel a confirmation and pay with another card', () => {
      cy.visit('localhost:3000/events/54');

      cy.contains('button', 'Meld deg på')
        .should('exist.and.not.be.disabled')
        .click();
      cy.wait(1000);

      fillCardDetails('4000 0000 0000 3063', '0230', '123');
      cy.contains('button', 'Betal').click();

      cy.wait(6000);
      confirm3DSecureDialog(false);
      stripeError()
        .contains('Vi kan ikke verifisere betalingsmåten din')
        .should('be.visible');

      clearCardDetails();
      fillCardDetails('4000 0027 6000 3184', '0230', '123');
      cy.contains('button', 'Betal').click();
      cy.wait(6000);
      confirm3DSecureDialog();

      cy.contains('Du har betalt').should('be.visible');
    });

    it('Should be possible to pay with interruptions in the middle', () => {
      cy.visit('localhost:3000/events/54');

      cy.contains('button', 'Meld deg på')
        .should('exist.and.not.be.disabled')
        .click();
      cy.wait(1000);

      fillCardDetails('3782 8224 6310 005', '0230', '123');
      cy.contains('button', 'Betal').click();

      cy.reload();
      cy.cachedLogin();

      cy.wait(1500);
      fillCardDetails('3782 8224 6310 005', '0230', '123');
      cy.contains('button', 'Betal').click();

      cy.contains('Du har betalt').should('be.visible');
    });
  } else {
    it('Skipping stripe tests (set env ENABLE_STRIPE to run)', () => {});
  }
});
