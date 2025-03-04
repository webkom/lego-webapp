import { field, fieldError, button } from '../support/utils.js';

describe('Change password', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  const password = 'Webkom123';
  const newPassword = 'Abakus123';
  const weakPassword = 'Testing123';

  it('can change password', () => {
    cy.visit('/users/me/settings/profile');
    cy.waitForHydration();

    cy.get('h2').contains('Avansert').click();

    button('Endre passord').should('be.disabled');
    field('password').type(password).blur();
    button('Endre passord').should('be.disabled');
    field('newPassword').type(newPassword).blur();
    button('Endre passord').should('be.disabled');
    field('retypeNewPassword').type(newPassword).blur();
    button('Endre passord').should('not.be.disabled').click();

    cy.url().should('not.include', `/users/me/settings/profile`);
    cy.url().should('include', `/users/me`);
  });

  it('should require certain password strength', () => {
    cy.visit('/users/me/settings/profile');
    cy.waitForHydration();
    cy.get('h2').contains('Avansert').click();

    field('password').type(password).blur();
    fieldError('newPassword').should('not.exist');
    button('Endre passord').should('be.disabled');

    field('newPassword').type(weakPassword).blur();
    fieldError('newPassword').should('exist');
    button('Endre passord').should('be.disabled');

    field('newPassword').clear().type(newPassword).blur();
    field('retypeNewPassword').clear().type(weakPassword).blur();
    fieldError('retypeNewPassword').should('contain', 'ikke like');
    button('Endre passord').should('be.disabled');

    field('newPassword').clear().type(weakPassword).blur();
    fieldError('newPassword').should('contain', 'for svakt');
    fieldError('retypeNewPassword').should('not.exist');
    button('Endre passord').should('be.disabled');

    field('password').clear().type('this is not my password').blur();
    field('newPassword').clear().type(newPassword).blur();
    field('retypeNewPassword').clear().type(newPassword).blur();
    button('Endre passord').should('not.be.disabled').click();
    fieldError('password').should('contain', 'Invalid password');
  });
});
