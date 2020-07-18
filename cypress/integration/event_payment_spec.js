import {
  c,
  field,
  fieldError,
  selectField,
  selectEditor,
} from '../support/utils.js';

describe('Create event', () => {
  beforeEach(() => {
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
    cy.resetDb();
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
    cy.contains('0/20');
    cy.contains('Arrangement');
    cy.contains('webkom webkom');
    cy.contains('WebkomPool');
    cy.contains('R4');
    cy.contains('Påmelding åpner');
    cy.contains('Dette er et betalt arrangement');
    cy.contains('205,-');
  });

  it('should be possible to register and pay', () => {
    cy.visit('/events/59');

    cy.contains('Meld deg på').click();
  });
});
