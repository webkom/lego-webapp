import {
  c,
  field,
  fieldError,
  selectField,
  selectEditor,
} from '../support/utils.js';

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
    cy.wait(1000);
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
    selectEditor().type('test');
    cy.wait(1000);

    cy.contains('button', 'OPPRETT').should('not.be.disabled').click();

    fieldError('cover').should('be.visible');
    fieldError('title').should('be.visible');
    fieldError('description').should('be.visible');
    fieldError('eventType').should('be.visible');

    // Upload file
    uploadHeader();
    fieldError('cover').should('not.exist');

    field('title').type('Testevent').blur();
    fieldError('title').should('not.exist');

    field('description').type('blir fett').blur();
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

    cy.contains('button', 'OPPRETT').should('not.be.disabled').click();

    cy.url().should('not.contain', '/events/create');
    cy.url().should('contain', '/events/');

    // Verify that created event looks good..
    cy.contains('Testevent');
    cy.contains('Sosialt');
  });

  it('should be possible to use the editor', () => {
    cy.visit('/events/create');

    // Click editor
    selectEditor();
    // Sidebar is visible
    cy.get('._legoEditor_Toolbar_root').should('be.visible');
    //cy.focused().type('{enter}hello{uparrow}lol{enter}');

    cy.get('._legoEditor_Toolbar_root button').first().click();
    // Format text
    cy.focused().type('This text should be large');
    cy.get('._legoEditor_root h1')
      .should('be.visible')
      .contains('This text should be large');
    //cy.focused().type('{enter}{backspace}');

    // Format bold and italic with keyboard shortcuts
    //cy.focused();
    //.type('{ctrl}b')
    //.type('This should be bold{ctrl}b')
    //.type('{ctrl}i')
    //.type('This should be italic{ctrl}i')
    //.type('No format');
    //cy.get('._legoEditor_root strong').contains('This should be bold');
    //cy.get('._legoEditor_root em').contains('This should be italic');
    //cy.get('._legoEditor_root p span')
    //.last()
    //.contains('No format');

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

    // This is needed so that the crop module is activated because of how we mock upload files in these tests
    cy.get('.ReactCrop__drag-handle.ord-n').click({ force: true });

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
    //cy.get('div[data-slate-editor="true"]').click();
    //cy.focused().type('{downarrow}');
    //cy.focused().type('{enter}EOF{enter}');
    cy.focused().type('EOF');

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
    field('title').type('Pils på Webkomkontoret!').blur();
    field('description').type('blir fett').blur();
    cy.contains('Type arrangement').find('.Select').click();
    cy.focused().type('sos{enter}', { force: true });

    // Create event
    cy.contains('button', 'OPPRETT').should('not.be.disabled').click();

    cy.url().should('not.contain', '/events/create');
    cy.url().should('contain', '/events/');

    // Verify that created event looks good..
    cy.contains('Pils på Webkomkontoret!');
    cy.contains('Sosialt');
    cy.contains('This text should be large');
    cy.get('._legoEditor_img').should('be.visible');
    cy.contains('EOF');
  });

  it('should be able so set the standard fields', () => {
    cy.visit('/events/create');
    uploadHeader();

    // Set title, description and text
    field('title').type('Standard event').blur();
    field('description').type('standard event').blur();
    selectEditor().type('standard event');

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

    cy.contains('button', 'OPPRETT').should('not.be.disabled').click();

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
    field('title').type('Ubestemt event').blur();
    field('description').type('mer info kommer').blur();
    selectEditor().type('mer info kommer');

    // Select type
    selectField('eventType').click();
    cy.focused().type('be{enter}', { force: true });

    // Select regitrationType
    selectField('eventStatusType').click();
    cy.focused().type('TBA{enter}', { force: true });

    cy.contains('button', 'OPPRETT').should('not.be.disabled').click();

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
    field('title').type('Normal event').blur();
    field('description').type('normal event').blur();
    selectEditor().type('normal event');

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
    field('pools[0].name').clear().type('WebkomPool').blur();
    field('pools[0].capacity').type('20').blur();
    selectField('pools[0].permissionGroups').click();
    cy.focused().type('Webkom', { force: true });
    selectField('pools[0].permissionGroups')
      .find('.Select-menu-outer')
      .should('not.contain', 'No results')
      .and('contain', 'Webkom');
    cy.focused().type('{enter}', { force: true });

    // Create new pool
    cy.contains('button', 'Legg til ny pool').should('not.be.disabled').click();
    field('pools[1].name').clear().type('BedkomPool').blur();
    field('pools[1].capacity').type('30').blur();
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
    cy.get(c('DatePicker__header')).find('button:last-child').click();
    cy.contains(c('DatePicker__calendarItem'), '15').click();

    cy.contains('button', 'OPPRETT').should('not.be.disabled').click();

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
    field('title').type('Open event').blur();
    field('description').type('open event').blur();
    selectEditor().type('open event');

    // Select type
    selectField('eventType').click();
    cy.focused().type('fes{enter}', { force: true });

    // Select regitrationType
    selectField('eventStatusType').click();
    cy.focused().type('Uten{enter}', { force: true });

    // Set location
    cy.contains('Sted').click();
    cy.focused().type('Kjellern');

    cy.contains('button', 'OPPRETT').should('not.be.disabled').click();

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
    field('title').type('Infinite event').blur();
    field('description').type('infinite event').blur();
    selectEditor().type('infinite event');

    // Select type
    selectField('eventType').click();
    cy.wait(50);
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
    field('pools[0].name').clear().type('Mange').blur();
    selectField('pools[0].permissionGroups').click();
    cy.focused().type('Abaku', { force: true });
    selectField('pools[0].permissionGroups')
      .find('.Select-menu-outer')
      .should('not.contain', 'No results')
      .and('contain', 'Abakus');
    cy.focused().type('{enter}', { force: true });

    cy.contains('button', 'OPPRETT').should('not.be.disabled').click();

    // Verify that created event looks good..
    cy.url().should('not.contain', '/events/create');
    cy.url().should('contain', '/events/');
    cy.contains('Annet');
    cy.contains('Mange');
    cy.contains('0/∞');
  });
});
