// CSS Selector to match classnames by their prefix
const c = (classname) => `[class^=${classname}]`;

describe('The Home Page and Login', () => {
  it('successfully loads landing page', () => {
    cy.visit('/');
    cy.contains('Velkommen til Abakus');

    cy.contains('a', 'Arrangementer');
    cy.contains('a', 'For bedrifter');
    cy.contains('a', 'Om Abakus');

    cy.contains('h3', 'Bedpres og Kurs');
    cy.contains('li', 'DIPS');

    cy.contains('h3', 'Arrangementer');
    cy.contains('li', 'Sikkerhet og Sårbarhet');

    cy.contains('h2', 'Siste artikkel');
    cy.contains('h2', 'Siste utgave av');
    cy.contains('h2', 'Nyttige linker');
    cy.contains('h2', 'Vår Facebook side');
  });

  it('can log in from homepage', () => {
    // Login
    const username = 'webkom';

    cy.get('[name=username]').type(username);
    cy.get('[name=password]').type('Webkom123{enter}');

    // Click dropdown for user
    cy.get(c('Dropdown__content')).should('not.exist');
    cy.get(c('Header__menu')).find(c('Image__image')).click();

    cy.get(c('Dropdown__content')).should((dropdown) => {
      expect(dropdown).to.contain(username);
      expect(dropdown).to.contain('Innstillinger');
      expect(dropdown).to.contain('Møte');
      expect(dropdown).to.contain('Logg ut');
    });
  });

  it.only('successfully loads elements on frontpage when logged in', () => {
    cy.resetDb();
    cy.cachedLogin();
    cy.visit('/');

    cy.contains('h3', 'Bedpres og Kurs');
    cy.contains('li', 'Deloitte AS');
    cy.contains('li', 'Sikkerhet og Sårbarhet');

    cy.contains('h3', 'Sosialt');
    cy.contains('li', 'Eksamensfest');

    cy.contains('h3', 'Påmeldinger');

    cy.contains('div', 'FESTET');
    cy.contains('div', 'ARTIKKEL UTEN AUTH');

    cy.contains('span', 'readme');

    cy.contains('div', 'ARTIKLER');
    cy.contains('div', 'ARTIKKEL MED YOUTUBE COVER');
  });
});
