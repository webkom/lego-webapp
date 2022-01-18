import {
  field,
  fieldError,
  selectField,
  selectEditor,
} from '../support/utils.js';

describe('Create joblisting', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('Makes sure required fields are filled before allowing submit', () => {
    cy.visit('/joblistings/create');
    // Check that validation errors show only after we click "Lagre"
    fieldError('title').should('not.exist');
    fieldError('description').should('not.exist');
    fieldError('eventType').should('not.exist');
    cy.contains('button', 'Lagre').should('be.disabled');

    // fill out only required fields in form and enable Lagre button
    field('title').type('Sommerjobb hos BEKK');
    selectField('company').click();
    cy.focused().type('BEKK', { force: true });
    selectField('company')
      .find('.Select-menu-outer')
      .should('not.contain', 'No results')
      .and('contain', 'BEKK');
    cy.focused().type('{enter}', { force: true });

    // TODO sometimes there is an issue in the joblisting editor where you have to click
    // the top editor twice. Not a breaking bug.
    selectEditor('description').type('A joblisting description');
    selectEditor('text').type('Joblisting text');

    cy.contains('button', 'Lagre').should('not.be.disabled');

    //TODO: når du fyller ut og så fjerner teksten igjen så skal det ikke funke.
    //cy.get('div[data-slate-editor="true"]')
    //.first()
    //.clear();
    //cy.contains('button', 'Lagre').should('be.disabled');

    cy.contains('button', 'Lagre').should('not.be.disabled').click();
    //TODO: check new url
    cy.contains('h2', 'Sommerjobb hos BEKK');
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
