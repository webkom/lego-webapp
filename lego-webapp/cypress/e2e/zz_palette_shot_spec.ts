import { ctrlKey } from '~/cypress/support/utils';

describe('shots', () => {
  it('palette in both themes', () => {
    cy.viewport(1000, 700);
    cy.visit('/');
    cy.waitForHydration();
    cy.get('body').type(`${ctrlKey}k`);
    cy.get('input[placeholder="Søk på kommandoer…"]').type('tema');
    cy.contains('[role="menuitem"]', 'Bytt til mørkt tema').should('be.visible');
    cy.screenshot('palette-light', { capture: 'viewport', overwrite: true });
    cy.contains('[role="menuitem"]', 'Bytt til mørkt tema').click();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    cy.get('body').type(`${ctrlKey}k`);
    cy.get('input[placeholder="Søk på kommandoer…"]').type('tema');
    cy.contains('[role="menuitem"]', 'Bytt til lyst tema').should('be.visible');
    cy.screenshot('palette-dark', { capture: 'viewport', overwrite: true });
    cy.get('input[placeholder="Søk på kommandoer…"]').clear();
    cy.screenshot('palette-dark-full', { capture: 'viewport', overwrite: true });
  });
});
