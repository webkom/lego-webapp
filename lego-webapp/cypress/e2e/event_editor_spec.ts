import {
  selectField,
  c,
  t,
  field,
  uploadHeader,
  selectEditor,
  getEditorToolbar,
  getEditorContent,
  ctrlKey,
} from '~/cypress/support/utils';

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
    cy.visit('/events/new');
    cy.waitForHydration();

    // Click editor
    selectEditor();
    // Sidebar is visible
    getEditorToolbar().should('be.visible');
    cy.focused().click().type('{enter}hello{uparrow}lol{enter}');

    getEditorToolbar().find('button').first().click();
    // Format text
    cy.focused().type('This text should be large');
    getEditorContent()
      .find('h1')
      .should('be.visible')
      .contains('This text should be large');
    cy.focused().type('{enter}');

    // Format bold and italic with keyboard shortcuts
    cy.focused()
      .type(`${ctrlKey}b`)
      .type(`This should be bold${ctrlKey}b`)
      .type(`${ctrlKey}i`)
      .type(`This should be italic${ctrlKey}i`)
      .type('{enter}No format');
    getEditorContent().find('strong').contains('This should be bold');
    getEditorContent().find('em').contains('This should be italic');
    getEditorContent().find('p').contains('No format');

    // No image in article before adding it
    getEditorContent().find('img').should('not.exist');

    // Open file upload modal
    cy.get(c('_modal')).should('not.exist');

    getEditorToolbar().find('button[aria-label=Image]').click();
    cy.get(c('_modal')).should('be.visible');

    cy.get(t('Modal__content'))
      .get('button')
      .contains('Last opp')
      .should('be.disabled');

    // Upload file
    cy.upload_file(
      `${c('_modal')} ${c('_dropArea')} span`,
      'images/screenshot.png',
    );

    // Wait for image to appear
    cy.get('.cropper-container').should('be.visible');

    cy.get(t('Modal__content'))
      .get('button')
      .contains('Last opp')
      .should('not.be.disabled')
      .click();

    // Image is inside article
    getEditorContent().find('img').should('be.visible').and('have.attr', 'src');

    // Navigate past image with arrow keys and add text on bottom
    selectEditor();
    cy.focused().type('{downarrow}{enter}');
    cy.focused().type('{enter}{enter}EOF{enter}');

    // Fill rest of form
    uploadHeader();
    field('title').type('Pils på Webkomkontoret!').blur();
    field('description').type('blir fett').blur();
    selectField('eventType').click();
    cy.focused().type('sos{enter}', { force: true });
    field('useMazemap').uncheck();
    field('location').type('DT').blur();
    field('isClarified').check();

    // Create event
    cy.contains('button', 'Opprett').should('not.be.disabled').click();

    cy.url().should('not.contain', '/events/new');
    cy.url().should('contain', '/events/');

    // Verify that created event looks good..
    cy.contains('Pils på Webkomkontoret!');
    cy.contains('Sosialt');
    cy.contains('This text should be large');
    getEditorContent().find('img').should('be.visible');
    cy.contains('EOF');
  });
});
