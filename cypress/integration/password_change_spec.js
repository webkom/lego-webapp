import { field, fieldError } from '../support/utils.js';

describe('Change password', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  const password = 'Webkom123';
  const newPassword = 'Abakus123';
  const weakPassword = '123';
  const weakServerPassword = 'Testing123';

  it('Can change password', () => {
    cy.visit('/users/me/settings/profile');

    cy.contains('Change Password').should('be.disabled');
    field('password').type(password).blur();
    cy.contains('Change Password').should('be.disabled');
    field('newPassword').type(newPassword).blur();
    cy.contains('Change Password').should('be.disabled');
    field('retypeNewPassword').type(newPassword).blur();
    cy.contains('Change Password').should('not.be.disabled').click();

    cy.url().should('not.include', `/users/me/settings/profile`);
    cy.url().should('include', `/users/me`);
  });

  it('Should require certain password strength', () => {
    cy.visit('/users/me/settings/profile');

    field('password').type(password).blur();
    fieldError('newPassword').should('not.exist');
    cy.contains('Change Password').should('be.disabled');

    field('newPassword').type(weakPassword).blur();
    fieldError('newPassword').should('exist');
    cy.contains('Change Password').should('be.disabled');

    field('newPassword').clear().type(weakServerPassword).blur();
    field('retypeNewPassword').clear().type(weakPassword).blur();
    fieldError('newPassword').should('not.exist');
    fieldError('retypeNewPassword').should('contain', 'ikke like');
    cy.contains('Change Password').should('be.disabled');

    field('retypeNewPassword').clear().type(weakServerPassword).blur();
    fieldError('retypeNewPassword').should('not.exist');
    cy.contains('Change Password').should('not.be.disabled').click();
    fieldError('newPassword').should('contain', 'too common');
    cy.contains('Change Password').should('be.disabled');

    field('password').clear().type('this is not my password').blur();
    field('newPassword').clear().type(newPassword).blur();
    field('retypeNewPassword').clear().type(newPassword).blur();
    cy.contains('Change Password').should('not.be.disabled').click();
    fieldError('password').should('contain', 'Invalid password');
  });
});
