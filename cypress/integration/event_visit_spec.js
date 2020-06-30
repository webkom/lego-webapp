import { c } from '../support/utils.js';

describe('View event', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('Make sure we can view event details', () => {
    cy.visit('/events/20');

    // Check that the event details are correct
    cy.get(c('Content__cover') + ' img').should('be.visible');
    cy.contains('Eksamenskurs i Java');
    cy.contains('Kurs');
    cy.contains('Du er påmeldt');
    cy.get(c('AttendanceStatus'))
      .find('button')
      .should('contain', '9/15')
      .click();
    // When clicking on attendees we should get the modal
    cy.get(c('Modal')).should('be.visible');
    cy.get(c('AttendanceModal__list') + ' li').should('have.length', 9);

    cy.get('body').click(20, 20);
    cy.get(c('Modal')).should('not.exist');
  });

  it('Should be possible to update event details', () => {
    // Update message
    cy.contains('button', 'Oppdater').should('be.disabled');
    cy.get('#feedback').click().type('This is some feedback text');
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
    cy.contains('button', 'Kommenter').should('not.exist');
    cy.get(c('CommentForm') + ' [data-slate-editor="true"]')
      .last()
      .as('form')
      .editorFocus()
      .click();
    cy.wait(100);
    cy.contains('button', 'Kommenter').as('button').should('not.be.disabled');
    cy.focused().editorType('This event will be awesome');
    cy.wait(700);
    cy.contains('button', 'Kommenter').click();

    // We should see the comment and be able to delete it
    cy.get(c('Comment__comment')).within(($c) => {
      cy.contains('This event will be awesome');
      cy.contains('button', 'Svar').should('exist').and('not.be.disabled');
      cy.contains('button', 'Slett')
        .should('exist')
        .and('not.be.disabled')
        .click();
      cy.contains('Slettet');
      cy.contains('button', 'svar').should('not.exist');
    });

    // Nested comments should work as expected
    // TODO fix form clearing
    cy.reload();
    cy.get(c('CommentForm') + ' [data-slate-editor="true"]')
      .last()
      .editorFocus()
      .click();
    cy.wait(100);
    cy.focused().editorType('This is the top comment');
    cy.wait(500);
    cy.contains('button', 'Kommenter').click();

    cy.get(c('Comment__comment')).last().contains('This is the top comment');
    cy.contains('button', 'Svar').click();
    cy.contains('button', 'Send svar').should('exist').and('be.disabled');

    cy.wait(500);

    // With out custom methods for interacting with the editor, we need to fire events on some
    // other elements first.
    cy.contains('allergier').click();
    cy.get(c('CommentForm') + ' [data-slate-editor="true"]')
      .first()
      .editorFocus()
      .click()
      .wait(100);
    cy.focused().editorType('This is a child comment');
    cy.contains('button', 'Send svar').click();
    cy.get(c('CommentTree__nested')).contains('This is a child comment');
  });
});
