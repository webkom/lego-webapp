import { field } from '../support/utils.js';

const createCompanyInterest = () => {
  cy.visit('/interesse');

  field('companyName')
    .click()
    .type('webkom consulting');

  field('contactPerson')
    .click()
    .type('webkom');

  field('mail')
    .click()
    .type('webkom@webkom.no');

  field('semesters[0].checked').check();
  field('events[0].checked').check();
  field('otherOffers[0].checked').check();

  field('comment').type('random comment');

  cy.contains('Opprett bedriftsinteresse').click();
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

    cy.contains('webkom');
    cy.contains('webkom@webkom.no');
    cy.contains('Slett')
      .click()
      .click();

    cy.should('not.contain', 'webkom');
  });

  it('should not be able to create if invalid input', () => {
    cy.visit('/interesse');

    field('companyName')
      .click()
      .type('webkom consulting');

    field('contactPerson')
      .click()
      .type('webkom');

    field('mail')
      .click()
      .type('webkom@webko');

    field('comment').type('random comment');

    cy.contains('Opprett bedriftsinteresse').click();

    cy.url().should('not.include', `/companyInterest`);
  });

  it('should be able to edit company interest', () => {
    createCompanyInterest();
    cy.url().should('include', `/companyInterest`);
    cy.contains('webkom consulting').click();
    cy.url().should('include', `edit`);

    field('contactPerson').should('have.value', 'webkom');
    field('mail').should('have.value', 'webkom@webkom.no');
    field('comment').should('have.value', 'random comment');

    field('companyName').type('plebkom');

    field('semesters[0].checked').should('have.attr', 'checked');
    field('events[0].checked').should('have.attr', 'checked');
    field('otherOffers[0].checked').should('have.attr', 'checked');

    cy.contains('Oppdater bedriftsinteresse').click();
    cy.url().should('not.include', `edit`);
    cy.contains('plebkom');
  });
});
