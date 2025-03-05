import { c, t } from '../support/utils.js';

describe('The Home Page and Login', () => {
  it('successfully loads landing page', () => {
    cy.visit('/');
    cy.waitForHydration();
    cy.contains('Velkommen til Abakus');

    cy.contains('a', 'Arrangementer');
    cy.contains('a', 'For bedrifter');
    cy.contains('a', 'Om Abakus');

    cy.contains('h3', 'Bedpres og kurs');
    cy.contains(c('_eventItem'), 'DIPS');

    cy.contains('h3', 'Arrangementer');
    cy.contains(c('_eventItem'), 'Sikkerhet og Sårbarhet');

    cy.contains('h3', 'Oppslag');
    cy.contains('span', 'readme');
    cy.contains('h3', 'Nyttige lenker');
  });

  it('can log in from homepage', () => {
    // Login
    const username = 'webkom';

    cy.get('[name=username]').type(username);
    cy.get('[name=password]').type('Webkom123{enter}');

    // Click dropdown for user
    cy.get(t('dropdown') + ' ' + c('_content')).should('not.exist');
    cy.get('header ' + c('_menu'))
      .find(c('_image'))
      .click();

    cy.get(t('dropdown') + ' ' + c('_content')).should((dropdown) => {
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
    cy.waitForHydration();

    cy.contains('h3', 'Bedpres og kurs');
    cy.contains(c('_eventItem'), 'Deloitte AS');

    cy.contains('h3', 'Arrangementer');
    cy.contains(c('_eventItem'), 'Sikkerhet og Sårbarhet');

    cy.contains('h3', 'Påmeldinger');

    cy.contains('h3', 'Oppslag');
    cy.contains('a', 'Artikkel uten AUTH');

    cy.contains('span', 'readme');

    cy.contains('h3', 'Artikler');

    cy.contains('h2', 'Deloitte AS');
    cy.contains('h2', 'Mesan');
    cy.contains('h2', 'Sikkerhet og Sårbarhet').should('not.exist');
    cy.get('ion-icon[name="chevron-down-outline"]').click();
    cy.contains('h2', 'Sikkerhet og Sårbarhet');
    cy.contains('a', 'Artikkel med youtube cover');
  });
});
