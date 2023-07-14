import { c, a } from '../support/utils.js';

describe('Navigate throughout app', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  // Open the hambuermenu and select by name, then assert by path
  const openMenuAndSelect = (name, path) => {
    cy.get(c('buttonGroup')).within(() => {
      cy.get(c('searchIcon')).click();
    });
    cy.get(c('Search__navigationFlex'))
      .first()
      .within(() => {
        cy.contains(name).click();
      });
    cy.url().should('contain', path);
  };

  it('should be able to navigate to events', () => {
    cy.visit('/');
    cy.get(c('navigation')).within(() => {
      cy.contains('Arrangementer').click();
    });
    cy.url().should('contain', '/events');
    cy.contains('Denne uken');
    cy.contains('Liste');
  });

  it('should be able to navigate to joblistings', () => {
    cy.visit('/');
    cy.get(c('navigation')).within(() => {
      cy.contains('Karriere').click();
    });
    cy.url().should('contain', '/joblistings');
    cy.contains('Jobbannonser');
    cy.contains('Søknadsfrist');
  });

  it('should be able to navigate to about-page', () => {
    cy.visit('/');
    cy.get(c('navigation')).within(() => {
      cy.contains('Om Abakus').click();
    });
    cy.url().should('contain', '/pages/info-om-abakus');
    cy.contains('Generelt');
    cy.contains('Komiteer');
  });

  it('should be able to navigate to users profile', () => {
    cy.visit('/');
    cy.get(c('buttonGroup')).within(() => {
      cy.get('img[alt="user"]').click();
    });

    // Go to profile
    cy.get(c('Dropdown'))
      .first()
      .within(() => {
        cy.get(a('/users/me')).click();
      });
    cy.url().should('contain', '/users/me');
    cy.contains('Brukerinfo');
    cy.contains('Prikker');

    // Go to settings from profile
    cy.get(c('UserProfile__infoCard'))
      .first()
      .within(() => {
        cy.contains('Innstillinger').click();
      });
    cy.contains('Brukernavn');
  });

  it('should be able to navigate to users settings', () => {
    cy.visit('/');
    cy.get(c('buttonGroup')).within(() => {
      cy.get('img[alt="user"]').click();
    });

    // Go to users settings
    cy.get(c('Dropdown'))
      .first()
      .within(() => {
        cy.contains('Innstillinger').click();
      });
    cy.url().should('contain', '/users/me/settings');
    cy.contains('Brukernavn');

    // Go to notifications
    cy.get(c('NavigationTab'))
      .first()
      .within(() => {
        cy.contains('Notifikasjoner').click();
      });
    cy.url().should('contain', '/users/me/settings/notifications');
    cy.contains('E-poster som sendes direkte til deg');

    // Go to OAuth2
    cy.get(c('NavigationTab'))
      .first()
      .within(() => {
        cy.contains('OAuth2').click();
      });
    cy.url().should('contain', '/users/me/settings/oauth2');
    cy.contains('Denne nettsiden benytter seg av et API');

    // Go to student confirmation
    cy.get(c('NavigationTab'))
      .first()
      .within(() => {
        cy.contains('Verifiser studentstatus').click();
      });
    cy.url().should('contain', '/users/me/settings/student-confirmation');
    cy.contains('NTNU-brukernavn');
  });

  it('should be able to navigate to users meetings', () => {
    cy.visit('/');
    cy.get(c('buttonGroup')).within(() => {
      cy.get('img[alt="user"]').click();
    });

    // Go to meetings
    cy.get(c('Dropdown'))
      .first()
      .within(() => {
        cy.contains('Møteinnkallinger').click();
      });
    cy.url().should('contain', '/meetings');
    cy.contains('Dine møter');
    cy.contains('Hent gamle');

    // Go to create new
    cy.get(c('NavigationTab__details'))
      .first()
      .within(() => {
        cy.contains('a', 'Nytt møte').click();
      });
    cy.url().should('contain', '/meetings/create');
    cy.contains('Nytt møte');
    cy.contains('Tittel');

    // Go back to meetings
    cy.get(c('NavigationTab'))
      .first()
      .within(() => {
        cy.contains('Dine møter').click();
      });
    cy.url().should('contain', '/meetings');
    cy.contains('Dine møter');
  });

  it('should be able to access the extended menu', () => {
    cy.visit('/');

    // Go to the extended menu
    cy.get(c('buttonGroup')).within(() => {
      cy.get(c('searchIcon')).click();
    });
    cy.url().should('contain', '/');
    cy.contains('Sider');
    cy.contains('Arrangementer');
    cy.contains('Artikler');

    // Go back
    cy.get(c('closeButton')).click();
    cy.url().should('contain', '/');
    cy.contains('Festet oppslag');
    cy.contains('Påmeldinger');
  });

  it('should be able to navigate to different pages in the extended menu', () => {
    cy.visit('/');

    // Events
    openMenuAndSelect('Arrangementer', '/events');
    cy.contains('Liste');

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
    cy.contains('Søknadsfrist');

    // Contacs
    openMenuAndSelect('Kontakt Abakus', '/contact');
    cy.contains('Kontaktskjema for Abakus');

    // Meetings
    openMenuAndSelect('Møter', '/meetings');
    cy.contains('Dine møter');

    // About
    openMenuAndSelect('Om Abakus', '/pages/info-om-abakus');
    cy.contains('Generelt');

    // Profile
    openMenuAndSelect('Profil', '/users/me');
    cy.contains('Brukerinfo');

    // Quotes
    openMenuAndSelect('Overhørt', '/quotes');
    cy.contains('Just do it!');

    // Tags
    openMenuAndSelect('Tags', '/tags');
    cy.contains('lorem');
  });

  it('should be able to log out', () => {
    cy.visit('/');
    cy.get(c('buttonGroup')).within(() => {
      cy.get('img[alt="user"]').click();
    });

    // Logg out
    cy.get(c('Dropdown'))
      .first()
      .within(() => {
        cy.contains('Logg ut').click();
      });
    cy.url().should('contain', '/');
    cy.contains('Velkommen til Abakus');
    cy.contains('Logg inn');
  });
});
