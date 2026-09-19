import { c, t } from '~/cypress/support/utils';

describe('Navigate throughout app', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  // Open the hamburgermenu and select by name, then assert by path
  const openMenuAndSelect = (name, path) => {
    cy.get(`header ${c('_menu')} ${c('buttonGroup')}`).within(() => {
      cy.get(t('search-menu-icon')).click();
    });
    cy.get(c('_quickLinks_'))
      .first()
      .within(() => {
        cy.contains(name).click();
      });
    cy.url().should('contain', path);
  };

  it('should be able to access the extended menu', () => {
    cy.visit('/');
    cy.waitForHydration();

    // Go to the extended menu
    cy.get(c('buttonGroup')).within(() => {
      cy.get(t('search-menu-icon')).click();
    });
    cy.url().should('contain', '/');
    cy.contains('Sider');
    cy.contains('Arrangementer');
    cy.contains('Artikler');

    // Go back
    cy.get(t('search-menu-icon')).click();
    cy.url().should('contain', '/');
    cy.contains('Arrangementer');
    cy.contains('Påmeldinger');
  });

  it('should be able to navigate to different pages in the extended menu', () => {
    cy.visit('/');
    cy.waitForHydration();

    // Events
    openMenuAndSelect('Arrangementer', '/events');
    cy.contains('Oversikt');

    // Articles
    openMenuAndSelect('Artikler', '/articles');
    cy.contains('Ny artikkel');

    // Polls
    openMenuAndSelect('Avstemninger', '/polls');
    cy.contains('Avstemninger');

    // Companies
    openMenuAndSelect('Bedrifter', '/companies');
    cy.contains('Bedrifter');

    // Gallery
    openMenuAndSelect('Album', '/photos');
    cy.contains('Album');

    // Interestgroups
    openMenuAndSelect('Interessegrupper', '/events/interest');
    cy.contains('Interessegrupper');

    // Joblistings
    openMenuAndSelect('Jobbannonser', '/joblistings');
    cy.contains('Jobbannonser');

    // Contacs
    openMenuAndSelect('Kontakt Abakus', '/contact');
    cy.contains('Kontaktskjema for Abakus');

    // Meetings
    openMenuAndSelect('Møter', '/meetings');
    cy.contains('Dine møter');

    // About
    openMenuAndSelect('Om Abakus', '/pages/info-om-abakus');
    cy.contains('Generelt');

    // Quotes
    openMenuAndSelect('Overhørt', '/quotes');
    cy.contains('Just do it!');

    // Lending is currently featureflagged and was removed from this test
  });
});
