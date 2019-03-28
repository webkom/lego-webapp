// CSS Selector to match classnames by their prefix
const c = classname => `[class^=${classname}]`;

describe('The Home Page and Login', () => {
  it('successfully loads landing page', () => {
    cy.visit('/');
    cy.contains('Velkommen');
    cy.contains('Om Abakus');
  });

  it('can log in from homepage', () => {
    // Login
    const username = 'webkom';

    cy.get('[name=username]').type(username);
    cy.get('[name=password]').type('Webkom123{enter}');

    // Click dropdown for user
    cy.get(c('Dropdown__content')).should('not.exist');
    cy.get(c('Header__menu'))
      .find(c('Image__image'))
      .click();

    cy.get(c('Dropdown__content')).should(dropdown => {
      expect(dropdown).to.contain(username);
      expect(dropdown).to.contain('Innstillinger');
      expect(dropdown).to.contain('Møte');
      expect(dropdown).to.contain('Logg ut');
    });
  });
});
