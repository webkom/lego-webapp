import { c, a } from '../support/utils.js';

describe('Create event', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  const openMenu = () => {
    cy.get(c('buttonGroup')).within(() => {
      cy.get(c('searchIcon')).click();
    });
  };

  it('should be able to navigate to events', () => {
    cy.visit('/');
    cy.get(c('navigation')).within(() => {
      cy.get(a('/events')).click();
    });
    cy.url().should('contain', '/events');
    cy.contains('Denne uken');
    cy.contains('Liste');
  });

  it('should be able to navigate to joblistings', () => {
    cy.visit('/');
    cy.get(c('navigation')).within(() => {
      cy.get(a('/joblistings')).click();
    });
    cy.url().should('contain', '/joblistings');
    cy.contains('Jobbannonser');
    cy.contains('Søknadsfrist');
  });

  it('should be able to navigate to about-page', () => {
    cy.visit('/');
    cy.get(c('navigation')).within(() => {
      cy.get(a('/pages/info-om-abakus')).click();
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
    cy.get(c('Dropdown')).within(() => {
      cy.get(a('/users/me')).click();
    });
    cy.url().should('contain', '/users/me');
    cy.contains('Brukerinfo');
    cy.contains('Prikker');

    // Go to settings from profile
    cy.get(c('UserProfile__infoCard')).within(() => {
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
    cy.get(c('Dropdown')).within(() => {
      cy.get(a('/users/me/settings/profile')).click();
    });
    cy.url().should('contain', '/users/me/settings');
    cy.contains('Brukernavn');

    // Go to notifications
    cy.get(c('NavigationTab')).within(() => {
      cy.get(a('/users/me/settings/notifications')).click();
    });
    cy.url().should('contain', '/users/me/settings/notifications');
    cy.contains('Eposter som sendes direkte til deg');

    // Go to OAuth2
    cy.get(c('NavigationTab')).within(() => {
      cy.get(a('/users/me/settings/oauth2')).click();
    });
    cy.url().should('contain', '/users/me/settings/oauth2');
    cy.contains('Denne nettsiden benytter seg av et API');

    // Go to student confirmation
    cy.get(c('NavigationTab')).within(() => {
      cy.get(a('/users/me/settings/student-confirmation')).click();
    });
    cy.url().should('contain', '/users/me/settings/student-confirmation');
    cy.contains('NTNU Brukernavn');
  });

  it('should be able to navigate to users meetings', () => {
    cy.visit('/');
    cy.get(c('buttonGroup')).within(() => {
      cy.get('img[alt="user"]').click();
    });

    // Go to meetings
    cy.get(c('Dropdown')).within(() => {
      cy.get(a('/meetings/')).click();
    });
    cy.url().should('contain', '/meetings');
    cy.contains('Dine Møter');
    cy.contains('Hent gamle');

    // Go to create new
    cy.get(c('NavigationTab')).within(() => {
      cy.get(a('/meetings/create/')).click();
    });
    cy.url().should('contain', '/meetings/create');
    cy.contains('Nytt møte');
    cy.contains('Tittel');

    // Go back to meetings
    cy.get(c('NavigationTab')).within(() => {
      cy.get(a('/meetings/')).click();
    });
    cy.url().should('contain', '/meetings');
    cy.contains('Dine Møter');
  });

  it('should be able to access the extended menu', () => {
    cy.visit('/');

    // Go to the extended menu
    openMenu();
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
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/events')).click();
    });
    cy.url().should('contain', '/events');
    cy.contains('Liste');

    // Articles
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/articles')).click();
    });
    cy.url().should('contain', '/articles');
    cy.contains('Ny artikkel');

    // Polls
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/polls')).click();
    });
    cy.url().should('contain', '/polls');
    cy.contains('Avstemninger');

    // Companies
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/companies')).click();
    });
    cy.url().should('contain', '/companies');
    cy.contains('Bedrifter');

    // Gallery
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/photos')).click();
    });
    cy.url().should('contain', '/photos');
    cy.contains('Albumer');

    // Interestgroups
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/interestgroups')).click();
    });
    cy.url().should('contain', '/interestgroups');
    cy.contains('Interessegrupper');

    // Joblistings
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/joblistings')).click();
    });
    cy.url().should('contain', '/joblistings');
    cy.contains('Søknadsfrist');

    // Contacs
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/contact')).click();
    });
    cy.url().should('contain', '/contact');
    cy.contains('Kontaktskjema for Abakus');

    // Meetings
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/meetings')).click();
    });
    cy.url().should('contain', '/meetings');
    cy.contains('Dine Møter');

    // About
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/pages/info-om-abakus')).click();
    });
    cy.url().should('contain', '/pages/info-om-abakus');
    cy.contains('Generelt');

    // Podcast
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/podcasts')).click();
    });
    cy.url().should('contain', '/podcasts');
    cy.contains('Podcasts');

    // Profile
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/users/me')).click();
    });
    cy.url().should('contain', '/users/me');
    cy.contains('Brukerinfo');

    // Quotes
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/quotes/?filter=all')).click();
    });
    cy.url().should('contain', '/quotes/?filter=all');
    cy.contains('Just do it!');

    // Tags
    openMenu();
    cy.get(c('Search__navigationFlex')).within(() => {
      cy.get(a('/tags')).click();
    });
    cy.url().should('contain', '/tags');
    cy.contains('lorem');
  });

  it('should be able to logg out', () => {
    cy.visit('/');
    cy.get(c('buttonGroup')).within(() => {
      cy.get('img[alt="user"]').click();
    });

    // Logg out
    cy.get(c('Dropdown')).within(() => {
      cy.get(c('Button')).click();
    });
    cy.url().should('contain', '/');
    cy.contains('Velkommen til Abakus');
    cy.contains('Logg inn');
  });
});
