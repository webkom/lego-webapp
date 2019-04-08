import { c, field, fieldError, selectField } from '../support/utils.js';

describe('Create event', () => {
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

  it('should fill required fields before being allowed to submit', () => {
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

    // Upload file
    uploadHeader();
    fieldError('cover').should('not.exist');

    field('title')
      .type('Testevent')
      .blur();
    fieldError('title').should('not.exist');

    field('description')
      .type('blir fett')
      .blur();
    fieldError('description').should('not.exist');

    // TODO: Make the suggestion box open if you click the label, not only when you click the input field
    selectField('eventType').click();
    /* selectField('eventType')
      .find('.Select-menu-outer')
      .should(results => {
        expect(results).to.contain('Bedriftspresentasjon');
        expect(results).to.contain('Sosialt');
        expect(results).to.contain('Annet');
      }); */
    cy.focused().type('sos', { force: true });
    /* selectField('eventType')
      .find('.Select-menu-outer')
      .should(results => {
        expect(results).to.not.contain('Bedriftspresentasjon');
        expect(results).to.contain('Sosialt');
        expect(results).to.not.contain('Annet');
      }); */
    cy.focused().type('{enter}', { force: true });
    fieldError('eventType').should('not.exist');

    cy.contains('button', 'OPPRETT')
      .should('not.be.disabled')
      .click();

    cy.url().should('not.contain', '/events/create');
    cy.url().should('contain', '/events/');

    // Verify that created event looks good..
    cy.contains('Testevent');
    cy.contains('Sosialt');
  });

  it('should be possible to use the editor', () => {
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

  it('should be able so set the standard fields', () => {
    cy.visit('/events/create');
    uploadHeader();

    // Set title, description and text
    field('title')
      .type('Standard event')
      .blur();
    field('description')
      .type('standard event')
      .blur();
    cy.get('div[name="text"]').click();
    cy.focused().type('standard event');

    // Select type
    selectField('eventType').click();
    cy.focused().type('be{enter}', { force: true });

    // Select company
    selectField('company').click();
    cy.focused().type('BEKK', { force: true });
    selectField('company')
      .find('.Select-menu-outer')
      .should('not.contain', 'No results')
      .and('contain', 'BEKK');
    cy.focused().type('{enter}', { force: true });

    // Select group
    selectField('responsibleGroup').click();
    cy.focused().type('bedk', { force: true });
    selectField('responsibleGroup')
      .find('.Select-menu-outer')
      .should('not.contain', 'No results')
      .and('contain', 'Bedkom');
    cy.focused().type('{enter}', { force: true });

    cy.contains('button', 'OPPRETT')
      .should('not.be.disabled')
      .click();

    // Verify that created event looks good..
    cy.url().should('not.contain', '/events/create');
    cy.url().should('contain', '/events/');
    cy.contains('Standard event');
    cy.contains('Bedriftspresentasjon');
    cy.contains('BEKK');
    cy.contains('TBA');
    cy.contains('webkom webkom');
  });

  it('should be possible to create TBA event', () => {
    cy.visit('/events/create');
    uploadHeader();

    // Set title, description and text
    field('title')
      .type('Ubestemt event')
      .blur();
    field('description')
      .type('mer info kommer')
      .blur();
    cy.get('div[name="text"]').click();
    cy.focused().type('mer info kommer');

    // Select type
    selectField('eventType').click();
    cy.focused().type('be{enter}', { force: true });

    // Select regitrationType
    selectField('eventStatusType').click();
    cy.focused().type('TBA{enter}', { force: true });

    cy.contains('button', 'OPPRETT')
      .should('not.be.disabled')
      .click();

    // Verify that created event looks good..
    cy.url().should('not.contain', '/events/create');
    cy.url().should('contain', '/events/');
    cy.contains('Ubestemt event');
    cy.contains('mer info kommer');
    cy.contains('TBA');
  });

  it('should be possible to create NORMAL event', () => {
    cy.visit('/events/create');
    uploadHeader();

    // Set title, description and text
    field('title')
      .type('Normal event')
      .blur();
    field('description')
      .type('normal event')
      .blur();
    cy.get('div[name="text"]').click();
    cy.focused().type('normal event');

    // Select type
    selectField('eventType').click();
    cy.focused().type('be{enter}', { force: true });

    // Select regitrationType
    selectField('eventStatusType').click();
    cy.focused().type('Vanlig{enter}', { force: true });

    // Set location
    cy.contains('Sted').click();
    cy.focused().type('R4');

    // Set the first pool
    field('pools[0].name')
      .clear()
      .type('WebkomPool')
      .blur();
    field('pools[0].capacity')
      .type('20')
      .blur();
    selectField('pools[0].permissionGroups').click();
    cy.focused().type('Webkom', { force: true });
    selectField('pools[0].permissionGroups')
      .find('.Select-menu-outer')
      .should('not.contain', 'No results')
      .and('contain', 'Webkom');
    cy.focused().type('{enter}', { force: true });

    // Create new pool
    cy.contains('button', 'Legg til ny pool')
      .should('not.be.disabled')
      .click();
    field('pools[1].name')
      .clear()
      .type('BedkomPool')
      .blur();
    field('pools[1].capacity')
      .type('30')
      .blur();
    selectField('pools[1].permissionGroups').click();
    cy.focused().type('Bedkom', { force: true });
    selectField('pools[1].permissionGroups')
      .find('.Select-menu-outer')
      .should('not.contain', 'No results')
      .and('contain', 'Bedkom');
    cy.focused().type('{enter}', { force: true });
    selectField('pools[1].permissionGroups').click();
    cy.focused().type('Abakus', { force: true });
    selectField('pools[1].permissionGroups')
      .find('.Select-menu-outer')
      .should('not.contain', 'No results')
      .and('contain', 'Abakus');
    cy.focused().type('{enter}', { force: true });

    field('mergeTime').click();
    cy.get(c('DatePicker__selectedDate'))
      .next()
      .click();

    cy.contains('button', 'OPPRETT')
      .should('not.be.disabled')
      .click();

    // Verify that created event looks good..
    cy.url().should('not.contain', '/events/create');
    cy.url().should('contain', '/events/');
    cy.contains('0/20');
    cy.contains('0/30');
    cy.contains('Bedriftspresentasjon');
    cy.contains('webkom webkom');
    cy.contains('WebkomPool');
    cy.contains('BedkomPool');
    cy.contains('R4');
    cy.contains('Påmelding åpner');
  });

  it('should be possible to create OPEN event', () => {
    cy.visit('/events/create');
    uploadHeader();

    // Set title, description and text
    field('title')
      .type('Open event')
      .blur();
    field('description')
      .type('open event')
      .blur();
    cy.get('div[name="text"]').click();
    cy.focused().type('open event');

    // Select type
    selectField('eventType').click();
    cy.focused().type('fes{enter}', { force: true });

    // Select regitrationType
    selectField('eventStatusType').click();
    cy.focused().type('Uten{enter}', { force: true });

    // Set location
    cy.contains('Sted').click();
    cy.focused().type('Kjellern');

    cy.contains('button', 'OPPRETT')
      .should('not.be.disabled')
      .click();

    // Verify that created event looks good..
    cy.url().should('not.contain', '/events/create');
    cy.url().should('contain', '/events/');
    cy.contains('Fest');
    cy.contains('Open event');
    cy.contains('Kjellern');
  });

  it('should be possible to create INFINITE event', () => {
    cy.visit('/events/create');
    uploadHeader();

    // Set title, description and text
    field('title')
      .type('Infinite event')
      .blur();
    field('description')
      .type('infinite event')
      .blur();
    cy.get('div[name="text"]').click();
    cy.focused().type('intifite event');

    // Select type
    selectField('eventType').click();
    cy.focused().type('anne{enter}', { force: true });

    // Select regitrationType
    selectField('eventStatusType').click();
    cy.focused().type('Med på{enter}', { force: true });

    // Set location
    cy.contains('Sted').click();
    cy.focused().type('EL6');

    // Images
    field('useConsent').check();

    // Question
    field('feedbackRequired').check();
    field('feedbackDescription').type('Burger eller sushi');

    // Set the first pool
    field('pools[0].name')
      .clear()
      .type('Mange')
      .blur();
    selectField('pools[0].permissionGroups').click();
    cy.focused().type('Abaku', { force: true });
    selectField('pools[0].permissionGroups')
      .find('.Select-menu-outer')
      .should('not.contain', 'No results')
      .and('contain', 'Abakus');
    cy.focused().type('{enter}', { force: true });

    cy.contains('button', 'OPPRETT')
      .should('not.be.disabled')
      .click();

    // Verify that created event looks good..
    cy.url().should('not.contain', '/events/create');
    cy.url().should('contain', '/events/');
    cy.contains('Annet');
    cy.contains('Mange');
    cy.contains('0/∞');
  });
});
