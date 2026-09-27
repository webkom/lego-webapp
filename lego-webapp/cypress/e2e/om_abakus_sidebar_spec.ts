/*
 * Sidebar behaviour is covered by cypress/component/LineSidebar.cy.tsx. This
 * only checks the wiring that needs the real page: the route reaching the
 * sidebar, and the mobile drawer closing after navigation.
 */
describe('Om Abakus sidebar', () => {
  it('marks the current page and closes the mobile drawer on navigation', () => {
    cy.viewport(390, 844);
    cy.visit('/pages/bedrifter/for-bedrifter');
    cy.waitForHydration();

    cy.contains('h1', 'For bedrifter')
      .parent()
      .find('button[aria-expanded="false"]')
      .click();

    cy.get('[role="dialog"]')
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Bedrifter').should(
          'have.attr',
          'aria-expanded',
          'true',
        );
        cy.get('a[href="/pages/bedrifter/for-bedrifter"]').should(
          'have.attr',
          'aria-current',
          'page',
        );

        cy.contains('button', 'Generelt').click();
        cy.get('a[href="/pages/info-om-abakus"]').click();
      });

    cy.location('pathname').should('eq', '/pages/info-om-abakus');
    cy.get('[role="dialog"]').should('not.exist');
  });
});
