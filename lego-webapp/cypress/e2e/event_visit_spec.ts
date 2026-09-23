import { c, t } from '~/cypress/support/utils';

describe('View event', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('Make sure we can view event details', () => {
    cy.visit('/events/20');
    cy.waitForHydration();

    // Check that the event details are correct
    cy.get(t('page-cover') + ' img').should('be.visible');
    cy.contains('Eksamenskurs i Java');
    cy.contains('Kurs');
    cy.contains('Du er påmeldt');
    cy.get(t('attendance-box'))
      .find('button')
      .should('contain', '9/15')
      .click();
    // When clicking on attendees we should get the modal
    cy.get(t('Modal__content')).should('be.visible');
    cy.get(t('attendance-modal-content') + ' ' + c('_list') + ' li').should(
      'have.length',
      9,
    );

    cy.get('body').click(20, 20);
    cy.get(t('Modal__content')).should('not.exist');
  });

  it('filters attendees by name, class, and group', () => {
    cy.visit('/events/20');
    cy.waitForHydration();
    cy.get(t('attendance-box')).find('button').click();

    const attendeeList = t('attendance-modal-content') + ' ' + c('_list');

    cy.get(attendeeList + ' li').should('have.length', 9);
    cy.contains('button', '1. Klasse').should('not.exist');
    cy.get('[data-test-id="attendance-filter-trigger"]').click();
    cy.get('[role="dialog"][aria-label="Filtrer deltakere"]')
      .should('contain', 'Kull')
      .and('contain', '1. Klasse')
      .and('contain', '5. Klasse');
    cy.focused().type('{esc}');

    cy.get('input[placeholder="Søk etter navn eller skriv :gruppe"]')
      .as('attendanceSearch')
      .type('Jaclyn');
    cy.get(attendeeList + ' li')
      .should('have.length', 1)
      .and('contain', 'Jaclyn Burke');

    cy.get('@attendanceSearch').clear().type(':we');
    cy.get('[role="listbox"][aria-label="Gruppeforslag"]')
      .should('be.visible')
      .and('contain.text', 'Webkom');
    cy.get('[role="option"]')
      .should('have.length', 1)
      .and('have.attr', 'aria-selected', 'true');

    cy.get('@attendanceSearch').type('{enter}').should('have.value', '');
    cy.get('[role="listbox"][aria-label="Gruppeforslag"]').should('not.exist');
    cy.get('[data-test-id="attendance-filter-chip"]')
      .should('have.length', 1)
      .and('contain.text', 'Webkom');
    cy.get(attendeeList + ' li')
      .should('have.length', 1)
      .and('contain.text', 'webkom webkom');

    cy.get('@attendanceSearch').clear().type(':3');
    cy.contains('[role="option"]', '3. Klasse').click();
    cy.get('@attendanceSearch').should('have.value', '');
    cy.get('[data-test-id="attendance-filter-chip"]')
      .should('have.length', 2)
      .and('contain.text', '3. Klasse');
    cy.get(attendeeList + ' li')
      .should('have.length', 1)
      .and('contain.text', 'webkom webkom');

    cy.get('@attendanceSearch').clear().type(':not-a-group');
    cy.get('[role="listbox"][aria-label="Gruppeforslag"]')
      .should('be.visible')
      .and('contain.text', 'Ingen grupper matcher søket.');
    cy.get(attendeeList + ' li')
      .should('have.length', 1)
      .and('contain.text', 'webkom webkom');

    cy.get('@attendanceSearch').type('{esc}');
    cy.get('[role="listbox"][aria-label="Gruppeforslag"]').should('not.exist');
    cy.get(t('Modal__content')).should('be.visible');
    cy.get('@attendanceSearch').clear();
    cy.get(attendeeList + ' li').should('have.length', 1);
    cy.contains('button', 'Nullstill').click();
    cy.get(attendeeList + ' li').should('have.length', 9);
  });

  it('Should only be possible to update event feedback for events where it is required', () => {
    cy.visit('/events/19');
    cy.waitForHydration();
    cy.get('#feedback').should('not.exist');

    cy.visit('/events/20');
    cy.waitForHydration();
    cy.contains('button', 'Oppdater').should('be.disabled');
    cy.get('#feedback').click().type('noe lættis');
    cy.contains('button', 'Oppdater').should('not.be.disabled').click();
    // We should get a toast confirming
    cy.contains('Tilbakemelding oppdatert');
  });

  // TODO make it possible to unregister in dev
  //it('Should be possible to unregister', () => {

  //cy.get("Avregistrer").click()
  //cy.get(c('Modal')).should('be.visible')
  //cy.get('button', 'Avbryt').should('be.visible')
  //cy.get('button', 'Ja').should('be.visible').click()

  //cy.contains('Du er ikke påmeldt')
  //})

  it('Should be possible to comment', () => {
    cy.visit('/events/20');
    cy.waitForHydration();

    cy.contains('button', 'Kommenter').should('not.be.visible');
    cy.get(t('comment-form')).find('input').first().click();
    cy.focused().type('This event will be awesome');
    cy.contains('button', 'Kommenter').should('be.visible').click();

    // We should see the comment and be able to delete it
    cy.get(c('_comment'))
      .last()
      .within(() => {
        cy.contains('This event will be awesome');
        cy.contains('button', 'Svar').should('exist').and('not.be.disabled');
        cy.get(t('delete-comment-button'))
          .should('exist')
          .and('not.be.disabled')
          .click();
        cy.contains('Kommentar slettet');
        cy.contains('button', 'Svar').should('not.exist');
      });

    cy.get(t('comment-form')).find('input').last().click();
    cy.focused().type('This is the top comment');
    cy.contains('button', 'Kommenter').should('be.visible').click();

    cy.get(c('_comment')).last().contains('This is the top comment');
    cy.contains('button', 'Svar').click();

    cy.get(t('comment-form'))
      .find('input')
      .should('have.lengthOf', 2)
      .last()
      .click();
    cy.focused().type('This is a child comment');
    cy.contains('button', 'Send svar').click();
    cy.get(c('_nested')).contains('This is a child comment');
  });
});
