import { c, field, fieldError } from '../support/utils.js';

describe('Profile settings', () => {
  beforeEach(() => cy.login());

  // This user is in initial backend
  const initialUser = {
    username: 'webkom',
    firstName: 'webkom',
    lastName: 'webkom',
    gender: 'male',
    allergies: '',
    email: 'webkom@aba.wtf'
  };

  const updatedUser = {
    username: 'webkom',
    firstName: 'web',
    lastName: 'komite',
    gender: 'female',
    allergies: 'gluten',
    email: 'webkom@web.kom'
  };

  it('can navigate to profile from homepage (menubar)', () => {
    cy.visit('/');
    cy.get(c('Header__menu'))
      .find(c('Image__image'))
      .click();
    cy.contains(c('Dropdown__content') + ' li', initialUser.username).click();
    cy.url().should('include', '/users/me');
  });

  it('can navigate to settings from menubar', () => {
    cy.visit('/');
    cy.get(c('Header__menu'))
      .find(c('Image__image'))
      .click();
    cy.contains(c('Dropdown__content') + ' li', 'Innstillinger').click();
    cy.url().should('include', '/users/me/settings/profile');
  });

  it('can navigate to settings from profile', () => {
    cy.visit('/users/me');
    cy.contains('Innstillinger').click();

    // TODO: Should use me in URL instead of username
    // cy.url().should('include', '/users/me/settings/profile');
    cy.url().should(
      'include',
      `/users/${initialUser.username}/settings/profile`
    );
  });

  it('edit profile shows correct initial values', () => {
    cy.visit('/users/me/settings/profile');

    cy.get('input[name=username]')
      .should('have.value', initialUser.username)
      .and('be.disabled');
    cy.get('input[name=firstName]')
      .should('have.value', initialUser.firstName)
      .and('not.be.disabled');
    cy.get('input[name=lastName]')
      .should('have.value', initialUser.lastName)
      .and('not.be.disabled');
    cy.get('input[name=gender]:checked')
      .should('have.value', initialUser.gender)
      .and('not.be.disabled');
    cy.get('input[name=allergies]')
      .should('have.value', initialUser.allergies)
      .and('not.be.disabled');
    cy.get('input[name=email]')
      .should('have.value', initialUser.email)
      .and('not.be.disabled');
  });

  it('can change profile', () => {
    cy.visit('/users/me/settings/profile');

    cy.contains('Submit').should('be.disabled');
    cy.get('input[name=firstName]')
      .clear()
      .type(updatedUser.firstName);
    cy.get('input[name=lastName]')
      .clear()
      .type(updatedUser.lastName);
    cy.get('input[name=gender]').check(updatedUser.gender);
    cy.get('input[name=allergies]')
      .clear()
      .type(updatedUser.allergies);
    cy.get('input[name=email]')
      .clear()
      .type(updatedUser.email);

    cy.contains('Submit')
      .should('not.be.disabled')
      .click();

    // TODO: Should use me in URL instead of username
    // cy.url().should('include', '/users/me');
    cy.url().should('include', `/users/${initialUser.username}`);

    cy.window().then(win => {
      // TODO: Should be scrolled to top
      // expect(win.scrollY).to.be.closeTo(0, 50);
    });

    // Check that settings were changed properly
    cy.visit('/users/me/settings/profile');
    cy.get('input[name=username]')
      .should('have.value', updatedUser.username)
      .and('be.disabled');
    cy.get('input[name=firstName]')
      .should('have.value', updatedUser.firstName)
      .and('not.be.disabled');
    cy.get('input[name=lastName]')
      .should('have.value', updatedUser.lastName)
      .and('not.be.disabled');
    cy.get('input[name=gender]:checked')
      .should('have.value', updatedUser.gender)
      .and('not.be.disabled');
    cy.get('input[name=allergies]')
      .should('have.value', updatedUser.allergies)
      .and('not.be.disabled');
    cy.get('input[name=email]')
      .should('have.value', updatedUser.email)
      .and('not.be.disabled');
  });

  it('profile settings form should show proper errors', () => {
    cy.visit('/users/me/settings/profile');

    const submitButton = () => cy.contains('Submit');

    // firstName field validation
    field('firstName')
      .clear()
      .blur();

    fieldError('firstName').should('contain', 'må fylles ut');

    submitButton().should('be.disabled');

    field('firstName')
      .type(initialUser.firstName)
      .blur();

    submitButton().should('not.be.disabled');

    // lastName field validation
    field('lastName')
      .clear()
      .blur();

    fieldError('lastName').should('contain', 'må fylles ut');

    submitButton().should('be.disabled');

    field('lastName')
      .type(initialUser.lastName)
      .blur();

    submitButton().should('not.be.disabled');

    cy.get('input[name=gender]').check(initialUser.gender);
    submitButton().should('not.be.disabled');

    // allergies field validation
    field('allergies')
      .clear()
      .blur();

    fieldError('allergies').should('not.exist');
    submitButton().should('not.be.disabled');

    // email field validation
    field('email')
      .clear()
      .blur();

    fieldError('email').should('contain', 'må fylles ut');

    submitButton().should('be.disabled');

    field('email')
      .type(initialUser.email)
      .blur();

    submitButton()
      .should('not.be.disabled')
      .click();

    // TODO: Should use me in URL instead of username
    // cy.url().should('include', '/users/me');
    cy.url().should('include', `/users/${initialUser.username}`);
  });

  it('does not allow user to set @abakus.no email', () => {
    cy.visit('/users/me/settings/profile');

    const submitButton = () => cy.contains('Submit');

    field('email')
      .clear()
      .type('webkom@abakus.no')
      .blur();
    submitButton().click();
    fieldError('email').should('contain', 'abakus.no');
  });
});
