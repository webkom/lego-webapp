import { c, t } from '../support/utils';

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
