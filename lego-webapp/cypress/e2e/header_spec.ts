describe('Header', () => {
  it('keeps the menu button in place when opening search', () => {
    cy.viewport(1200, 900);
    cy.visit('/');
    cy.waitForHydration();

    cy.window().then((window) => {
      expect(
        window.innerWidth - window.document.documentElement.clientWidth,
        'vertical scrollbar width',
      ).to.be.greaterThan(0);
    });

    cy.get('[data-test-id="search-menu-icon"]')
      .should('be.visible')
      .then(($button) => {
        const { left, right } = $button[0].getBoundingClientRect();
        cy.wrap({
          left,
          right,
          clientWidth: document.documentElement.clientWidth,
        }).as('menuButtonMetrics');
      });

    cy.get('[data-test-id="search-menu-icon"]').click();
    cy.get('input[placeholder="Hva leter du etter?"]').should('be.visible');

    cy.get<{ left: number; right: number; clientWidth: number }>(
      '@menuButtonMetrics',
    ).then((before) => {
      cy.get('[data-test-id="search-menu-icon"]').then(($button) => {
        const { left, right } = $button[0].getBoundingClientRect();

        expect(left).to.be.closeTo(before.left, 1);
        expect(right).to.be.closeTo(before.right, 1);
        expect(document.documentElement.clientWidth).to.equal(
          before.clientWidth,
        );
      });
    });
  });
});
