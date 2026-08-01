import {
  field,
  selectField,
  t,
  NO_OPTIONS_MESSAGE,
} from '~/cypress/support/utils';

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
  // The switch is a button next to the hidden input the field is found by
  field('officeInTrondheim').parent().find('button').click();

  // Chips hide their input visually and the option cards cover theirs with the
  // label overlay that makes the whole card clickable, so every box below has
  // to be checked with force, the same way the toggle switch above is clicked.
  field('semesters[0].checked').check({ force: true });
  field('events[0].checked').check({ force: true });
  field('otherOffers[0].checked').check({ force: true });
  field('companyType').check({ force: true });
  field('comment').type('random comment');
  field('companyPresentationComment').type('some pitch for presentation');

  cy.contains('Send bedriftsinteresse').click();
};

describe('Company interest', () => {
  beforeEach(() => {
    cy.resetDb();
  });
  it('Should be able to create company interest', () => {
    createCompanyInterest();
    // Success toast
    cy.contains('Bedriftsinteresse opprettet');
    cy.url().should('include', '/pages/bedrifter/for-bedrifter');
  });

  it('should keep filled fields when switching language', () => {
    cy.visit('/interesse');
    cy.waitForHydration();

    field('contactPerson').click().type('webkom');
    field('semesters[0].checked').check({ force: true });

    cy.contains('button', 'English').click();
    cy.url().should('include', 'lang=en');
    cy.contains('Submit interest');
    field('contactPerson').should('have.value', 'webkom');
    field('semesters[0].checked').should('be.checked');

    cy.contains('button', 'Norsk').click();
    cy.url().should('not.include', 'lang=en');
    cy.contains('Send bedriftsinteresse');
    field('contactPerson').should('have.value', 'webkom');
  });
});

describe('Admin company interest', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('should be able to create and delete interest', () => {
    createCompanyInterest();
    cy.url().should('include', '/bdb/company-interest');

    cy.contains('tr', 'BEKK').within(() => {
      cy.contains('webkom');
      cy.contains('webkom@webkom.no');
    });

    cy.contains('tr', 'BEKK').find('button').click();
    cy.get(t('Modal__content')).should('be.visible').contains('Ja').click();

    cy.contains('tr', 'BEKK').should('not.exist');
  });

  it('should not be able to create if invalid input', () => {
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

    field('mail').click().type('webkom@webko');

    // Phone is left empty on purpose, it is required
    field('phone').click();

    field('comment').type('random comment');

    cy.contains('Send bedriftsinteresse').click();

    cy.url().should('include', '/interesse');
  });

  it('should be able to edit company interest', () => {
    createCompanyInterest();
    cy.url().should('include', '/bdb/company-interest');
    cy.contains('BEKK').click();
    cy.url().should('include', `edit`);

    field('contactPerson').should('have.value', 'webkom');
    field('mail').should('have.value', 'webkom@webkom.no');
    field('phone').should('have.value', '90909090');
    field('comment').should('have.value', 'random comment');

    field('contactPerson').type('plebkom');

    field('semesters[0].checked').should('be.checked');
    field('events[0].checked').should('be.checked');
    field('otherOffers[0].checked').should('be.checked');

    cy.contains('Oppdater bedriftsinteresse').click();
    cy.url().should('not.include', `edit`);
    cy.contains('plebkom');
  });
});
