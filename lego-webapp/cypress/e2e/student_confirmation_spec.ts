import { t } from '~/cypress/support/utils';

describe('Student confirmation', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('asks about membership after a successful FEIDE verification', () => {
    cy.intercept(
      { method: 'GET', pathname: '/api/v1/oidc/validate/' },
      {
        status: 'success',
        studyProgrammes: ['Datateknologi'],
        grade: '1. klasse Datateknologi',
      },
    ).as('validateStudentAuth');

    cy.visit('/users/me/settings/student-confirmation?code=code&state=state');
    cy.waitForHydration();
    cy.wait('@validateStudentAuth');

    cy.get(t('Modal__content'))
      .should('be.visible')
      .and('contain', 'Din studentstatus ble godkjent!')
      .and('contain', '1. klasse Datateknologi')
      .and('contain', 'Vil du bli medlem av Abakus?');

    cy.get('body').click(20, 20);
    cy.get(t('Modal__content')).should('not.exist');
  });
});
