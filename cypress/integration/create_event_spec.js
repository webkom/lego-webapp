import { c, field, fieldError } from '../support/utils.js';

describe('Create event', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login();
  });

  it('Makes sure required fields are filled before allowing submit', () => {
    cy.visit('/events/create');
    // Check that validation errors show only after we click "OPPRETT"
    fieldError('cover').should('not.exist');
    fieldError('title').should('not.exist');
    fieldError('description').should('not.exist');
    fieldError('eventType').should('not.exist');

    cy.contains('button', 'OPPRETT').should('be.disabled');
    // click editor to initialize form and enable OPPRETT button
    cy.get('div[name="text"]').click();

    cy.contains('button', 'OPPRETT')
      .should('not.be.disabled')
      .click();

    fieldError('cover').should('be.visible');
    fieldError('title').should('be.visible');
    fieldError('description').should('be.visible');
    fieldError('eventType').should('be.visible');

    // Fill in form

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
    fieldError('cover').should('not.exist');

    field('title')
      .type('Skrive tester på Webkomkontoret!')
      .blur();
    fieldError('title').should('not.exist');

    field('description')
      .type('blir fett')
      .blur();
    fieldError('description').should('not.exist');

    // TODO: Make the suggestion box open if you click the label, not only when you click the input field
    cy.contains('Type arrangement')
      .find('.Select')
      .click();
    cy.contains('Type arrangement')
      .find('.Select-menu-outer')
      .should(results => {
        expect(results).to.contain('Bedriftspresentasjon');
        expect(results).to.contain('Sosialt');
        expect(results).to.contain('Annet');
      });
    cy.focused().type('sos', { force: true });
    cy.contains('Type arrangement')
      .find('.Select-menu-outer')
      .should(results => {
        expect(results).to.not.contain('Bedriftspresentasjon');
        expect(results).to.contain('Sosialt');
        expect(results).to.not.contain('Annet');
      });
    cy.focused().type('{enter}', { force: true });
    fieldError('eventType').should('not.exist');

    cy.contains('button', 'OPPRETT')
      .should('not.be.disabled')
      .click();

    cy.url().should('not.contain', '/events/create');
    cy.url().should('contain', '/events/');

    // Verify that created event looks good..
    cy.contains('Skrive tester på Webkomkontoret!');
    cy.contains('Sosialt');
  });

  it('can use properly editor', () => {
    cy.visit('/events/create');

    // Click editor
    cy.get('div[name="text"]').click();
    // Sidebar is visible
    cy.get('.md-side-toolbar').should('be.visible');
    cy.focused().type('{enter}hello{uparrow}lol');
    // Sidebar not visible because there is text on current line
    cy.get('.md-side-toolbar').should('not.exist');

    // toolbar becomes visible only when text is selected
    cy.get('.md-editor-toolbar').should('not.be.visible');
    cy.focused().type('{selectall}');
    cy.get('.md-editor-toolbar').should('be.visible');
    cy.focused().type('test article{enter}');
    cy.get('.md-editor-toolbar').should('not.be.visible');

    // Sidebar buttons are only visible when the sidebar is opened
    cy.get('button[title="Add an Image"]').should('not.exist');
    cy.get('button[title="Show editor info"]').should('not.exist');

    // Open, close and reopen sidebar
    cy.get('.md-side-toolbar')
      .should('be.visible')
      .click();
    cy.get('.md-open-button')
      .should('be.visible')
      .click();
    cy.get('.md-open-button').should('not.exist');
    cy.get('.md-side-toolbar')
      .should('be.visible')
      .click();
    cy.get('button[title="Add an Image"]').should('be.visible');
    cy.get('button[title="Show editor info"]').should('be.visible');

    // No image in article before adding it
    cy.get('.md-block-image').should('not.exist');

    // Open file upload modal
    cy.get(c('Modal__content')).should('not.exist');
    cy.get('button[title="Add an Image"]').click();
    cy.get(c('Modal__content')).should('be.visible');

    // TODO: Upload button should be disabled when no image is uploaded
    // cy.get(c('Modal__content')).contains('Last opp').should('be.disabled');

    // Upload file
    cy.upload_file(
      c('Modal__content') + ' ' + c('UploadImage__dropArea'),
      'images/screenshot.png'
    );

    // This is needed so that the crop module is activated because of how we mock upload files in these tests
    cy.get('.cropper-move').click();

    cy.get(c('Modal__content'))
      .contains('Last opp')
      .should('not.be.disabled')
      .click();

    // Image is inside article
    cy.get('.md-block-image').should('be.visible');

    // navigate past image with arrow keys and add text on bottom
    cy.get('div[name="text"]').click();
    cy.focused().type('{downarrow}');
    cy.get('.md-side-toolbar').should('not.exist');
    cy.focused().type('{enter}EOF{enter}');
    cy.get('.md-side-toolbar').should('be.visible');

    // Fill rest of form
    cy.upload_file(
      c('ImageUploadField__coverImage') + ' ' + c('UploadImage__dropArea'),
      'images/screenshot.png'
    );
    cy.get('.cropper-move').click();
    cy.get(c('Modal__content'))
      .contains('Last opp')
      .should('not.be.disabled')
      .click();
    field('title')
      .type('Pils på Webkomkontoret!')
      .blur();
    field('description')
      .type('blir fett')
      .blur();
    cy.contains('Type arrangement')
      .find('.Select')
      .click();
    cy.focused().type('sos{enter}', { force: true });

    // Create event
    cy.contains('button', 'OPPRETT')
      .should('not.be.disabled')
      .click();

    cy.url().should('not.contain', '/events/create');
    cy.url().should('contain', '/events/');

    // Verify that created event looks good..
    cy.contains('Pils på Webkomkontoret!');
    cy.contains('Sosialt');
    cy.contains('test article');
    cy.get('.md-block-image').should('be.visible');
    cy.contains('EOF');
  });
});
