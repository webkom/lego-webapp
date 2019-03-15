// CSS Selector to match classnames by their prefix
const c = classname => `[class^=${classname}]`;

describe('Profile', () => {
  beforeEach(() => cy.login());

  it('can navigate to profile from homepage (menubar)', () => {
    cy.visit('/');
    cy.get(c('Header__menu'))
      .find(c('Image__image'))
      .click();
    cy.contains(c('Dropdown__content') + ' li', 'webkom').click();
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
    cy.url().should('include', '/users/webkom/settings/profile');
  });

  it('edit profile shows correct initial values', () => {
    cy.visit('/users/me/settings/profile');

    cy.get('input[name=username]')
      .should('have.value', 'webkom')
      .and('be.disabled');
    cy.get('input[name=firstName]')
      .should('have.value', 'webkom')
      .and('not.be.disabled');
    cy.get('input[name=lastName]')
      .should('have.value', 'webkom')
      .and('not.be.disabled');
    cy.get('input[name=gender]:checked')
      .should('have.value', 'male')
      .and('not.be.disabled');
    cy.get('input[name=allergies]')
      .should('have.value', '')
      .and('not.be.disabled');
    cy.get('input[name=email]')
      .should('have.value', 'webkom@abakus.no')
      .and('not.be.disabled');
  });

  it('can change profile', () => {
    cy.visit('/users/me/settings/profile');

    cy.contains('Submit').should('be.disabled');
    cy.get('input[name=firstName]')
      .scrollIntoView()
      .clear()
      .type('web');
    cy.get('input[name=lastName]')
      .clear()
      .type('komite');
    cy.get('input[name=gender]').check('female');
    cy.get('input[name=allergies]')
      .clear()
      .type('gluten');
    cy.get('input[name=email]')
      .clear()
      .type('webkom@web.kom');

    cy.contains('Submit')
      .should('not.be.disabled')
      .click();

    // TODO: Should use me in URL instead of username
    // cy.url().should('include', '/users/me');
    cy.url().should('include', '/users/webkom');

    cy.window().then(win => {
      // TODO: Should scroll to top
      // expect(win.scrollY).to.be.closeTo(0, 50);
    });

    // Check that settings were changed properly
    cy.visit('/users/me/settings/profile');
    cy.get('input[name=username]')
      .should('have.value', 'webkom')
      .and('be.disabled');
    cy.get('input[name=firstName]')
      .should('have.value', 'web')
      .and('not.be.disabled');
    cy.get('input[name=lastName]')
      .should('have.value', 'komite')
      .and('not.be.disabled');
    cy.get('input[name=gender]:checked')
      .should('have.value', 'female')
      .and('not.be.disabled');
    cy.get('input[name=allergies]')
      .should('have.value', '')
      .and('not.be.disabled');
    cy.get('input[name=email]')
      .should('have.value', 'webkom@web.kom')
      .and('not.be.disabled');
  });

  it.skip('profile settings form should show proper errors', () => {
    cy.visit('/users/me/settings/profile');

    cy.get('input[name=firstName]')
      .scrollIntoView()
      .clear()
      .type('web');
    cy.get('input[name=lastName]')
      .clear()
      .type('komite');
    cy.get('input[name=gender]').check('female');
    cy.get('input[name=allergies]')
      .clear()
      .type('gluten');
    cy.get('input[name=email]')
      .clear()
      .type('webkom@web.kom');
    cy.contains('Submit').click();

    // TODO: Should use me in URL instead of username
    // cy.url().should('include', '/users/me');
    cy.url().should('include', '/users/webkom');
  });
});
