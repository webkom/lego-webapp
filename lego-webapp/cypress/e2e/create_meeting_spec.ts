import {
  c,
  selectFromSelectField,
  selectFieldDropdown,
  selectField,
} from '~/cypress/support/utils';

describe('Create meeting', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('should show correct options for referent', () => {
    cy.visit('/meetings/new');
    cy.waitForHydration();

    const verifyAuthors = (expectedAuthors) => {
      selectField('reportAuthor').click();
      selectFieldDropdown('reportAuthor')
        .find(c('option'))
        .should('have.length', expectedAuthors.length)
        .each((author, index) => {
          cy.wrap(author).should('contain.text', expectedAuthors[index]);
        });
      selectField('reportAuthor').click();
    };
    verifyAuthors(['webkom webkom']);

    selectFromSelectField('users', 'bedkom bedkom (bedkom)', 'bedkom');
    verifyAuthors(['webkom webkom', 'bedkom bedkom (bedkom)']);

    selectFromSelectField(
      'users',
      'Quinton Armstrong (quintonarmstrong)',
      'Quinton',
    );
    verifyAuthors([
      'webkom webkom',
      'bedkom bedkom (bedkom)',
      'Quinton Armstrong (quintonarmstrong)',
    ]);
  });
});
