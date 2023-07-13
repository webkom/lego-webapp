import { selectField, c, field } from '../support/utils.js';

const IS_MACOS = Cypress.platform.toLowerCase().search('darwin') !== -1;
const ctrlKey = IS_MACOS ? '{cmd}' : '{ctrl}';

describe('Editor', () => {
  /*
   * This test is here to be able to run proper tests against the editor.
   * Since we use electron in ci, and using cypress methods for type and click
   * on the editor only works in firefox.
   *
   * When editing anything related to the editor, it's a good idea to run this spec so you are sure
   * everything works as intended.
   */
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('should be possible to use the editor', () => {
    cy.visit('/events/create');

    // Click editor
    cy.get('div[data-slate-editor="true"]').click();
    // Sidebar is visible
    cy.get('._legoEditor_Toolbar_root').should('be.visible');
    cy.focused().click().type('{enter}hello{uparrow}lol{enter}');

    cy.get('._legoEditor_Toolbar_root button').first().click();
    // Format text
    cy.focused().type('This text should be large');
    cy.get('._legoEditor_root h1')
      .should('be.visible')
      .contains('This text should be large');
    cy.focused().type('{enter}{backspace}');

    // Format bold and italic with keyboard shortcuts
    cy.focused()
      .type(`${ctrlKey}b`)
      .type(`This should be bold${ctrlKey}b`)
      .type(`${ctrlKey}i`)
      .type(`This should be italic${ctrlKey}i`)
      .type('No format');
    cy.get('._legoEditor_root strong').contains('This should be bold');
    cy.get('._legoEditor_root em').contains('This should be italic');
    cy.get('._legoEditor_root p span').contains('No format');

    // No image in article before adding it
    cy.get('._legoEditor_root img').should('not.exist');

    // Open file upload modal
    cy.get('.ReactModal__Overlay').should('not.exist');
    cy.get(c('_legoEditor_imageUploader')).should('not.exist');

    cy.get('._legoEditor_root button .fa-image').click();
    cy.get('.ReactModal__Overlay').should('be.visible');

    // TODO: Upload button should be disabled when no image is uploaded
    // cy.get(c('Modal__content')).contains('Last opp').should('be.disabled');

    // Upload file
    cy.upload_file(
      '._legoEditor_imageUploader_dropZone',
      'images/screenshot.png'
    );

    // Wait for image to appear
    cy.get('.ReactCrop').should('be.visible');

    cy.get('._legoEditor_modal_applyButton')
      .contains('Apply')
      .should('not.be.disabled')
      .click();

    // Image is inside article
    cy.get('._legoEditor_figure').should('be.visible');
    cy.get('._legoEditor_img').should('be.visible').and('have.attr', 'src');

    // Caption is created
    cy.get('._legoEditor_figcaption').should('be.visible').contains('Caption');

    // Navigate past image with arrow keys and add text on bottom
    cy.get('div[data-slate-editor="true"]').click();
    cy.focused().type('{downarrow}{enter}');
    cy.focused().type('{enter}{enter}EOF{enter}');

    // Fill rest of form
    cy.upload_file(
      c('ImageUploadField__coverImage') +
        ' ' +
        c('UploadImage__placeholderTitle'),
      'images/screenshot.png'
    );
    cy.get('.cropper-move').click();
    cy.get(c('Modal__content'))
      .contains('Last opp')
      .should('not.be.disabled')
      .click();
    field('title').type('Pils på Webkomkontoret!').blur();
    field('description').type('blir fett').blur();
    selectField('eventType').click();
    cy.focused().type('sos{enter}', { force: true });
    field('useMazemap').uncheck();
    field('location').type('DT').blur();
    field('isClarified').check();

    // Create event
    cy.contains('button', 'Opprett').should('not.be.disabled').click();

    cy.url().should('not.contain', '/events/create');
    cy.url().should('contain', '/events/');

    // Verify that created event looks good..
    cy.contains('Pils på Webkomkontoret!');
    cy.contains('Sosialt');
    cy.contains('This text should be large');
    cy.get('._legoEditor_img').should('be.visible');
    cy.contains('EOF');
  });
});
