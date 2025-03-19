import { c, a, t, selectTab } from '../support/utils';

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

  it('should be able to navigate to events', () => {
    cy.visit('/');
    cy.waitForHydration();
    cy.get(c('navigation')).within(() => {
      cy.contains('Skibidi events😛💯🚽').click();
    });
    cy.url().should('contain', '/events');
    cy.contains('Denne 😂ruken😭🚨🚨🚨🚨🚨');
    cy.contains('Oversikt');
  });

  it('should be able to navigate to joblistings', () => {
    cy.visit('/');
    cy.waitForHydration();
    cy.get(c('navigation')).within(() => {
      cy.contains('Huzzle Season💼').click();
    });
    cy.url().should('contain', '/joblistings');
    cy.contains('Jobbannonser');
  });

  it('should be able to navigate to about-page', () => {
    cy.visit('/');
    cy.waitForHydration();
    cy.get(c('navigation')).within(() => {
      cy.contains('Om Abakus').click();
    });
    cy.url().should('contain', '/pages/info-om-abakus');
    cy.contains('Generelt');
    cy.contains('Komiteer');
  });

  it('should be able to navigate to users profile', () => {
    cy.visit('/');
    cy.waitForHydration();
    cy.get(c('buttonGroup')).within(() => {
      cy.get(`img[alt="webkom sitt profilbilde"]`).click();
    });

    // Go to profile
    cy.get(c('_content') + c('_popover'))
      .first()
      .within(() => {
        cy.get(a('/users/me')).click();
      });
    cy.url().should('contain', '/users/me');
    cy.contains('Brukerinfo');
    cy.contains('Prikker');

    // Go to settings from profile
    cy.contains('Innstillinger').click();
    cy.contains('Brukernavn');
  });

  it('should be able to navigate to users settings', () => {
    cy.visit('/');
    cy.waitForHydration();
    cy.get(c('buttonGroup')).within(() => {
      cy.get(`img[alt="webkom sitt profilbilde"]`).click();
    });

    // Go to users settings
    cy.get(c('_content') + c('_popover'))
      .first()
      .within(() => {
        cy.contains('Innstillinger').click();
      });
    cy.url().should('contain', '/users/me/settings');
    cy.contains('Brukernavn');

    // Go to notifications
    selectTab('Notifikasjoner');
    cy.url().should('contain', '/users/me/settings/notifications');
    cy.contains('E-poster som sendes direkte til deg');

    // Go to OAuth2
    selectTab('OAuth2');
    cy.url().should('contain', '/users/me/settings/oauth2');
    cy.contains('Denne nettsiden benytter seg av et API');

    // Go to student confirmation
    selectTab('Verifiser studentstatus');
    cy.url().should('contain', '/users/me/settings/student-confirmation');
    cy.contains('Verifiser studentstatus');
  });

  it('should be able to navigate to users meetings', () => {
    cy.visit('/');
    cy.waitForHydration();
    cy.get(c('buttonGroup')).within(() => {
      cy.get(`img[alt="webkom sitt profilbilde"]`).click();
    });

    // Go to meetings
    cy.get(c('_content') + c('_popover'))
      .first()
      .within(() => {
        cy.contains('Møteinnkallinger').click();
      });
    cy.url().should('contain', '/meetings');
    cy.contains('Dine møter');

    // Go to create new
    cy.contains('Nytt møte').click();
    cy.url().should('contain', '/meetings/new');
    cy.contains('Nytt møte');
    cy.contains('Tittel');

    // Go back to meetings
    cy.contains('Dine møter').click();
    cy.url().should('contain', '/meetings');
    cy.contains('Dine møter');
  });

  it('should be able to access the extended menu', () => {
    cy.visit('/');
    cy.waitForHydration();

    // Go to the extended menu
    cy.get(c('buttonGroup')).within(() => {
      cy.get(t('search-menu-icon')).click();
    });
    cy.url().should('contain', '/');
    cy.contains('Sider');
    cy.contains('Skibidi events😛💯🚽');
    cy.contains('Artikler');

    // Go back
    cy.get(t('search-menu-icon')).click();
    cy.url().should('contain', '/');
    cy.contains('Skibidi events😛💯🚽');
    cy.contains('Påmeldinger');
  });

  it('should be able to navigate to different pages in the extended menu', () => {
    cy.visit('/');
    cy.waitForHydration();

    // Events
    openMenuAndSelect('Skibidi events😛💯🚽', '/events');
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
    openMenuAndSelect('Interessegrupper', '/interest-groups');
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
    openMenuAndSelect('👀 🤫OVERHØRT🗣️🦻😬', '/quotes');
    cy.contains('Just do it!');

    // Forum
    openMenuAndSelect('Forum', '/forum');
    cy.contains('Forum');

    // Lending is currently featureflagged and was removed from this test
  });

  it('should be able to log out', () => {
    cy.visit('/');
    cy.waitForHydration();
    cy.get(c('buttonGroup')).within(() => {
      cy.get(`img[alt="webkom sitt profilbilde"]`).click();
    });

    // Logg out
    cy.get(c('_content') + c('_popover'))
      .first()
      .within(() => {
        cy.contains('Logg ut').click();
      });
    cy.url().should('contain', '/');
    cy.contains('Velkommen til Abakus');
    cy.contains('Logg inn');
  });
});
