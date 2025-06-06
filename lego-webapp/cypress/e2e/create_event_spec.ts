import {
  c,
  t,
  field,
  fieldError,
  selectField,
  selectFieldDropdown,
  selectEditor,
  setDatePickerDate,
  setDatePickerTime,
  uploadHeader,
  NO_OPTIONS_MESSAGE,
  getEditorToolbar,
  getEditorContent,
  ctrlKey,
} from '../support/utils';

describe('Create event', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('should fill required fields before being allowed to submit', () => {
    cy.visit('/events/new');
    cy.waitForHydration();

    // Check that validation errors show only after we click "Opprett"
    fieldError('cover').should('not.exist');
    fieldError('title').should('not.exist');
    fieldError('description').should('not.exist');
    fieldError('eventType').should('not.exist');
    fieldError('isClarified').should('not.exist');

    cy.contains('button', 'Opprett').should('be.disabled');
    // click editor to initialize form and enable Opprett button
    selectEditor().type('test');

    cy.contains('button', 'Opprett').should('not.be.disabled').click();

    fieldError('cover').should('be.visible');
    fieldError('title').should('be.visible');
    fieldError('description').should('be.visible');
    fieldError('eventType').should('be.visible');
    fieldError('isClarified').should('be.visible');

    // Upload file
    uploadHeader();
    fieldError('cover').should('not.exist');

    field('title').type('Testevent').blur();
    fieldError('title').should('not.exist');

    field('description').type('blir fett').blur();
    fieldError('description').should('not.exist');

    cy.contains('Sted').click();
    cy.focused().type('R4');
    fieldError('mazemapPoi').should('not.exist');
    fieldError('location').should('not.exist');

    field('isClarified').check();
    fieldError('isClarified').should('not.exist');

    // TODO: Make the suggestion box open if you click the label, not only when you click the input field
    selectField('eventType').click();
    cy.focused().type('sos', { force: true });
    cy.focused().type('{enter}', { force: true });
    fieldError('eventType').should('not.exist');

    cy.contains('button', 'Opprett').should('not.be.disabled').click();

    cy.url().should('not.contain', '/events/new');
    cy.url().should('contain', '/events/');

    // Verify that created event looks good..
    cy.contains('Testevent');
    cy.contains('Sosialt');
  });

  it('should be possible to use the editor', () => {
    cy.visit('/events/new');
    cy.waitForHydration();

    // Click editor
    selectEditor();
    // Sidebar is visible
    getEditorToolbar().should('be.visible');
    //cy.focused().type('{enter}hello{uparrow}lol{enter}');

    cy.focused().type('This text should be large');
    // Format text
    getEditorToolbar().find('button').first().click();
    getEditorContent()
      .find(`h1`)
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
    getEditorContent().find('p').last().contains('No format');

    // No image in article before adding it
    getEditorContent().find('img').should('not.exist');

    // Open file upload modal
    cy.get(c('_modal')).should('not.exist');

    getEditorToolbar().find('button[aria-label=Image]').click();

    cy.get(c('_modal')).should('be.visible');

    // Upload file
    cy.upload_file(
      `${c('_modal')} ${c('_dropArea')} span`,
      'images/screenshot.png',
    );

    cy.get(t('Modal__content'))
      .get('button')
      .contains('Last opp')
      .should('not.be.disabled')
      .click();

    // Image is inside article
    getEditorContent().find('img').should('be.visible').and('have.attr', 'src');

    // Navigate past image with arrow keys and add text on bottom
    selectEditor();
    cy.focused().type('{downarrow}');
    cy.focused().type('{enter}EOF{enter}');
    cy.focused().type('EOF');

    // Fill rest of form
    uploadHeader();
    field('title').type('Pils på Webkomkontoret!').blur();
    field('description').type('blir fett').blur();
    field('location').type('DT').blur();
    field('isClarified').check();
    selectField('eventType').click();
    cy.focused().type('sos{enter}', { force: true });

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

  it('should be able so set the standard fields', () => {
    cy.visit('/events/new');
    cy.waitForHydration();
    uploadHeader();

    // Set title, description and text
    field('title').type('Standard event').blur();
    field('description').type('standard event').blur();
    selectEditor().type('standard event');

    // Select type
    selectField('eventType').click();
    cy.focused().type('be{enter}', { force: true });

    field('location').type('DT').blur();

    // Select company
    selectField('company').click();
    cy.focused().type('BEKK', { force: true });
    selectFieldDropdown('company')
      .should('not.contain', NO_OPTIONS_MESSAGE)
      .and('contain', 'BEKK');
    cy.focused().type('{enter}', { force: true });

    // Select group
    selectField('responsibleGroup').click();
    cy.focused().type('bedk', { force: true });
    selectFieldDropdown('responsibleGroup')
      .should('not.contain', NO_OPTIONS_MESSAGE)
      .and('contain', 'Bedkom');
    cy.focused().type('{enter}', { force: true });

    // Check clarification
    field('isClarified').check();

    cy.contains('button', 'Opprett').should('not.be.disabled').click();

    // Verify that created event looks good..
    cy.url().should('not.contain', '/events/new');
    cy.url().should('contain', '/events/');
    cy.contains('Standard event');
    cy.contains('Bedriftspresentasjon');
    cy.contains('BEKK');
    cy.contains('TBA');
    cy.contains('webkom webkom');
  });

  it('should be possible to create TBA event', () => {
    cy.visit('/events/new');
    cy.waitForHydration();
    uploadHeader();

    // Set title, description and text
    field('title').type('Ubestemt event').blur();
    field('description').type('mer info kommer').blur();
    selectEditor().type('mer info kommer');
    field('location').type('DT').blur();

    // Select type
    selectField('eventType').click();
    cy.focused().type('be{enter}', { force: true });

    // Select regitrationType
    selectField('eventStatusType').click();
    cy.focused().type('TBA{enter}', { force: true });

    // Check clarification
    field('isClarified').check();

    cy.contains('button', 'Opprett').should('not.be.disabled').click();

    // Verify that created event looks good..
    cy.url().should('not.contain', '/events/new');
    cy.url().should('contain', '/events/');
    cy.contains('Ubestemt event');
    cy.contains('mer info kommer');
    cy.contains('TBA');
  });

  it('should be possible to create NORMAL event', () => {
    cy.visit('/events/new');
    cy.waitForHydration();
    uploadHeader();

    // Set title, description and text
    field('title').type('Normal event').blur();
    field('description').type('normal event').blur();
    selectEditor().type('normal event');

    // Select type
    selectField('eventType').click();
    cy.focused().type('be{enter}', { force: true });

    // Always select one day into the future to avoid test issues with "Påmelding åpner/stenger" variants changing
    const dateObject = new Date();
    const todayDay = dateObject.getDate();
    dateObject.setDate(dateObject.getDate() + 1);
    const tomorrowDay = dateObject.getDate();

    // Clicking three times to first clear the date then set both start and end to tomorrow
    setDatePickerDate('date', tomorrowDay, tomorrowDay < todayDay);
    setDatePickerDate('date', tomorrowDay, tomorrowDay < todayDay);
    setDatePickerDate('date', tomorrowDay, tomorrowDay < todayDay);

    setDatePickerTime('date', '10', '00', false); // Start time
    setDatePickerTime('date', '12', '00', true); // End time

    // Select regitrationType
    selectField('eventStatusType').click();
    cy.focused().type('Vanlig{enter}', { force: true });

    // Set location
    cy.contains('Sted').click();
    cy.focused().type('R4');

    // Set the first pool
    field('pools[0].name').clear().type('WebkomPool').blur();
    field('pools[0].capacity').type('20').blur();
    selectField('pools[0]\\.permissionGroups').click();
    cy.focused().type('Webkom', { force: true });
    selectFieldDropdown('pools\\[0\\]\\.permissionGroups')
      .should('not.contain', NO_OPTIONS_MESSAGE)
      .and('contain', 'Webkom');
    cy.focused().type('{enter}', { force: true });

    // Create new pool
    cy.contains('button', 'Legg til ny pool').should('not.be.disabled').click();
    field('pools[1].name').clear().type('BedkomPool').blur();
    field('pools[1].capacity').type('30').blur();
    selectField('pools[1]\\.permissionGroups').click();
    cy.focused().type('Bedkom', { force: true });
    selectFieldDropdown('pools\\[1\\]\\.permissionGroups')
      .should('not.contain', NO_OPTIONS_MESSAGE)
      .and('contain', 'Bedkom');
    cy.focused().type('{enter}', { force: true });
    selectField('pools[1]\\.permissionGroups').click();
    cy.focused().type('Abakus', { force: true });
    selectFieldDropdown('pools\\[1\\]\\.permissionGroups')
      .should('not.contain', NO_OPTIONS_MESSAGE)
      .and('contain', 'Abakus');
    cy.focused().type('{enter}', { force: true });

    setDatePickerDate('mergeTime', tomorrowDay, tomorrowDay < todayDay);

    // Check clarification
    field('isClarified').check();

    cy.contains('button', 'Opprett').should('not.be.disabled').click();

    // Verify that created event looks good..
    cy.url().should('not.contain', '/events/new');
    cy.url().should('contain', '/events/');
    cy.contains('0/20');
    cy.contains('0/30');
    cy.contains('Bedriftspresentasjon');
    cy.contains('webkom webkom');
    cy.contains('WebkomPool');
    cy.contains('BedkomPool');
    cy.contains('R4');
    cy.contains('Påmelding stenger');
  });

  it('should be possible to create OPEN event', () => {
    cy.visit('/events/new');
    cy.waitForHydration();
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

    // Check clarification
    field('isClarified').check();

    cy.contains('button', 'Opprett').should('not.be.disabled').click();

    // Verify that created event looks good..
    cy.url().should('not.contain', '/events/new');
    cy.url().should('contain', '/events/');
    cy.contains('Fest');
    cy.contains('Open event');
    cy.contains('Kjellern');
  });

  it('should be possible to create INFINITE event', () => {
    cy.visit('/events/new');
    cy.waitForHydration();
    uploadHeader();

    // Set title, description and text
    field('title').type('Infinite event').blur();
    field('description').type('infinite event').blur();
    selectEditor().type('infinite event');

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
    field('hasFeedbackQuestion').check();
    field('feedbackRequired').check();
    field('feedbackDescription').type('Burger eller sushi');

    // Set the first pool
    field('pools[0].name').clear().type('Mange').blur();
    selectField('pools[0].\\permissionGroups').click();
    cy.focused().type('Abaku', { force: true });
    selectFieldDropdown('pools\\[0\\]\\.permissionGroups')
      .should('not.contain', NO_OPTIONS_MESSAGE)
      .and('contain', 'Abakus');
    cy.focused().type('{enter}', { force: true });

    // Check clarification
    field('isClarified').check();

    cy.contains('button', 'Opprett').should('not.be.disabled').click();

    // Verify that created event looks good..
    cy.url().should('not.contain', '/events/new');
    cy.url().should('contain', '/events/');
    cy.contains('Annet');
    cy.contains('Mange');
    cy.contains('0/∞');
  });
});
