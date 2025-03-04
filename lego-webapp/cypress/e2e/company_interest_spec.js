import { field, selectField, NO_OPTIONS_MESSAGE } from '../support/utils.js';

const createCompanyInterest = () => {
  cy.visit('/interesse');
  cy.waitForHydration();

  // Select company
  selectField('company').click();
  cy.focused().type('BEKK', { force: true });
  selectField('company')
    .find('[id=react-select-company-listbox]')
    .should('not.contain', NO_OPTIONS_MESSAGE)
    .and('contain', 'BEKK');
  cy.focused().type('{enter}', { force: true });

  field('contactPerson').click().type('webkom');

  field('mail').click().type('webkom@webkom.no');

  field('phone').click().type('90909090');
  field('officeInTrondheim').click({ force: true });

  field('semesters[0].checked').check();
  field('events[0].checked').check();
  field('otherOffers[0].checked').check();
  field('companyType').check();
  field('comment').type('random comment');
  field('companyPresentationComment').type('some pitch for presentation');

  cy.contains('Send bedriftsinteresse').click();
};

describe('Company interest', () => {
  beforeEach(() => {
    cy.resetDb();
  });
  it.only('Should be able to create company interest', () => {
    createCompanyInterest();
    // Success toast
    cy.contains('Bedriftsinteresse opprettet');
    cy.url().should('include', '/pages/bedrifter/for-bedrifter');
  });
});

describe('Admin company interest', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('should be able to create and delete interest', () => {
    createCompanyInterest();
    cy.url().should('include', `/companyInterest`);

    cy.contains('BEKK');
    cy.contains('webkom@webkom.no');
    cy.contains('90909090');
    cy.contains('Slett').click().click();

    cy.should('not.contain', 'BEKK');
  });

  it('should not be able to create if invalid input', () => {
    cy.visit('/interesse');
    cy.waitForHydration();

    // Select company
    selectField('company').click();
    cy.focused().type('BEKK', { force: true });
    selectField('company')
      .find('.Select-menu-outer')
      .should('not.contain', NO_OPTIONS_MESSAGE)
      .and('contain', 'BEKK');
    cy.focused().type('{enter}', { force: true });

    field('contactPerson').click().type('webkom');

    field('mail').click().type('webkom@webko');

    field('phone').click().type('');

    field('comment').type('random comment');

    cy.contains('Send bedriftsinteresse').click();

    cy.url().should('not.include', `/companyInterest`);
  });

  it('should be able to edit company interest', () => {
    createCompanyInterest();
    cy.url().should('include', `/companyInterest`);
    cy.contains('BEKK').click();
    cy.url().should('include', `edit`);

    field('contactPerson').should('have.value', 'webkom');
    field('mail').should('have.value', 'webkom@webkom.no');
    field('phone').should('have.value', '90909090');
    field('comment').should('have.value', 'random comment');

    field('contactPerson').type('plebkom');

    field('semesters[0].checked').should('have.attr', 'checked');
    field('events[0].checked').should('have.attr', 'checked');
    field('otherOffers[0].checked').should('have.attr', 'checked');

    cy.contains('Oppdater bedriftsinteresse').click();
    cy.url().should('not.include', `edit`);
    cy.contains('plebkom');
  });
});
