describe('Om Abakus sidebar', () => {
  it('shows every original section and opens them independently', () => {
    cy.viewport(1200, 900);
    cy.visit('/pages/info-om-abakus');
    cy.waitForHydration();

    cy.get('nav[aria-label="Om Abakus"]')
      .should('contain.text', 'Om Abakus')
      .should('contain.text', 'Generelt')
      .and('contain.text', 'Organisasjon')
      .and('contain.text', 'Bedrifter')
      .and('contain.text', 'Komiteer');
    cy.get('nav[aria-label="Om Abakus"]')
      .contains('button', 'Generelt')
      .should('have.attr', 'aria-expanded', 'true');
    cy.get(
      'nav[aria-label="Om Abakus"] a[href="/pages/info-om-abakus"]',
    ).should('have.attr', 'aria-current', 'page');

    cy.get('nav[aria-label="Om Abakus"]')
      .contains('button', 'Bedrifter')
      .click()
      .should('have.attr', 'aria-expanded', 'true');
    cy.get('nav[aria-label="Om Abakus"]')
      .contains('button', 'Generelt')
      .should('have.attr', 'aria-expanded', 'true');
    cy.get(
      'nav[aria-label="Om Abakus"] a[href="/pages/bedrifter/for-bedrifter"]',
    ).should('be.visible');
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(
        document.documentElement.clientWidth,
      );
    });
  });

  it('leaves the article the larger share of the page', () => {
    cy.viewport(1200, 900);
    cy.visit('/pages/info-om-abakus');
    cy.waitForHydration();

    cy.get('nav[aria-label="Om Abakus"]').then(($nav) => {
      const sidebar = $nav.closest('[style*="grid-area"]').get(0);
      expect(sidebar.getBoundingClientRect().width).to.be.at.most(
        Cypress.config('viewportWidth') / 3,
      );
    });
  });

  it('keeps the current article selected on original article routes', () => {
    cy.viewport(1200, 900);
    cy.visit('/pages/bedrifter/for-bedrifter');
    cy.waitForHydration();

    cy.get('nav[aria-label="Om Abakus"]')
      .contains('button', 'Bedrifter')
      .should('have.attr', 'aria-expanded', 'true');
    cy.get(
      'nav[aria-label="Om Abakus"] a[href="/pages/bedrifter/for-bedrifter"]',
    ).should('have.attr', 'aria-current', 'page');
  });

  it('closes the mobile sidebar after navigating to an article', () => {
    cy.viewport(390, 844);
    cy.visit('/pages/info-om-abakus');
    cy.waitForHydration();

    cy.contains('h1', 'Info om Abakus')
      .parent()
      .find('button[aria-expanded="false"]')
      .click();
    cy.get('[role="dialog"]')
      .should('be.visible')
      .find(
        '[data-line-sidebar-layout="accordion"] a[href="/pages/info-om-abakus"]',
      )
      .click();

    cy.location('pathname').should('eq', '/pages/info-om-abakus');
    cy.get('[role="dialog"]').should('not.exist');
  });
});
