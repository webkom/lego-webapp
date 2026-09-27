describe('Header', () => {
  beforeEach(() => {
    cy.viewport(1200, 900);
    cy.visit('/');
    cy.waitForHydration();
  });

  it('keeps the menu button in place with a classic scrollbar', function () {
    cy.window().then((window) => {
      const scrollbarWidth =
        window.innerWidth - window.document.documentElement.clientWidth;

      if (scrollbarWidth === 0) {
        this.skip();
      }

      expect(scrollbarWidth, 'vertical scrollbar width').to.be.greaterThan(0);
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

  it('cascades links and closes as one unit', () => {
    cy.get('[data-test-id="search-menu-icon"]').click();
    cy.get('input[placeholder="Hva leter du etter?"]').should('be.visible');
    cy.get('[class*="_quickLink_"]').should(($links) => {
      expect($links.length).to.be.greaterThan(1);

      const firstLinkStyle = getComputedStyle($links[0]);
      const secondLinkStyle = getComputedStyle($links[1]);

      expect(firstLinkStyle.animationName).not.to.equal('none');
      expect(
        Number.parseFloat(firstLinkStyle.animationDuration),
      ).to.be.greaterThan(0);
      expect(
        Number.parseFloat(secondLinkStyle.animationDelay) -
          Number.parseFloat(firstLinkStyle.animationDelay),
      ).to.be.closeTo(0.012, 0.001);
      expect(Number.parseFloat(firstLinkStyle.animationDuration)).to.be.closeTo(
        0.15,
        0.001,
      );

      const firstLinkAnimation = $links[0].getAnimations()[0];
      const firstLinkKeyframes = (
        firstLinkAnimation.effect as KeyframeEffect
      ).getKeyframes();

      expect(firstLinkKeyframes[0].transform).to.contain('20px');
      expect(
        Number.parseFloat(
          getComputedStyle($links[$links.length - 1]).animationDelay,
        ),
      ).to.be.at.most(0.26);
    });
    cy.get('[data-test-id="quick-links-section"]').should(($sections) => {
      expect($sections.length).to.be.greaterThan(1);

      const firstSectionLinks = $sections[0].querySelectorAll(
        'a[class*="_quickLink_"]',
      );
      const secondSectionHeader = $sections[1].querySelector('h2');

      expect(firstSectionLinks.length).to.be.greaterThan(0);
      expect(secondSectionHeader).not.to.equal(null);

      if (secondSectionHeader) {
        const lastFirstSectionLink =
          firstSectionLinks[firstSectionLinks.length - 1];

        expect(
          Number.parseFloat(
            getComputedStyle(secondSectionHeader).animationDelay,
          ),
        ).to.be.greaterThan(
          Number.parseFloat(
            getComputedStyle(lastFirstSectionLink).animationDelay,
          ),
        );
      }
    });
    cy.get('[class*="_resultsContainer_"]').should(($resultsContainer) => {
      const resultsContainer = $resultsContainer[0];

      expect(getComputedStyle(resultsContainer).overflowX).to.equal('hidden');
      expect(resultsContainer.scrollWidth).to.equal(
        resultsContainer.clientWidth,
      );
    });

    cy.get('[data-test-id="search-menu-icon"]').click();
    cy.get('[data-test-id="search-overlay"]').should(($overlay) => {
      const overlayStyle = getComputedStyle($overlay[0]);

      expect(overlayStyle.animationName).to.contain('fade-out');
      expect(Number.parseFloat(overlayStyle.animationDuration)).to.be.closeTo(
        0.1,
        0.001,
      );
    });
    cy.get('[data-test-id="search-overlay"]').should('not.exist');
  });
});
