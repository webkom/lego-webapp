import {
  c,
  field,
  fieldError,
  selectField,
  selectEditor,
  selectFieldDropdown,
  NO_OPTIONS_MESSAGE,
} from '~/cypress/support/utils';

describe('Create joblisting', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('Makes sure required fields are filled before allowing submit', () => {
    cy.visit('/joblistings/new');
    cy.waitForHydration();
    // Check that validation errors show only after we click "Lagre endringer"
    fieldError('title').should('not.exist');
    fieldError('eventType').should('not.exist');
    cy.contains('button', 'Opprett').should('be.disabled');

    // fill out only required fields in form and enable "Lagre endringer" button
    field('title').type('Sommerjobb hos BEKK');
    selectField('company').click();
    cy.focused().type('BEKK', { force: true });
    selectFieldDropdown('company')
      .should('not.contain', NO_OPTIONS_MESSAGE)
      .and('contain', 'BEKK');
    cy.focused().type('{enter}', { force: true });

    selectField('workplaces').click();
    cy.focused().type('Oslo', { force: true });
    selectFieldDropdown('workplaces').and('contain', 'Oslo');
    cy.focused().type('{enter}', { force: true });

    cy.contains('button', 'Opprett').click();
    cy.get(c('fieldError')).should('exist');

    const text = 'Joblisting text';
    selectEditor('text').type(text);

    selectEditor('text').should('contain', text);

    cy.get(c('fieldError')).should('not.exist');

    cy.contains('button', 'Opprett').should('not.be.disabled').click();
    cy.url().should('not.contain', '/joblistings/new');
    cy.url().should('contain', '/joblistings/');
    cy.contains('h1', 'Sommerjobb hos BEKK');
  });
});

describe('Browse in joblistings', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('Check that only valid data is shown', () => {
    cy.visit('/joblistings');
  });
});
