import {
  c,
  field,
  fieldError,
  selectEditor,
  setDatePickerTime,
  selectFromSelectField,
  selectFieldDropdown,
  selectField,
  fieldErrors,
} from '../support/utils.js';

describe('Create meeting', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('should show correct validation errors', () => {
    cy.visit('/meetings/create');
    // Check that validation errors show only after we try to submit
    fieldErrors().should('not.exist');

    // verify initial values are set
    field('useMazemap').should('be.checked');
    field('startTime').should('not.have.value', '');
    field('endTime').should('not.have.value', '');

    cy.contains('button', 'Lag møte').should('be.disabled');
    // change the meeting time to enable submit button
    field('startTime').click();
    cy.get(c('TimePicker__arrowIcon')).first().click();

    cy.contains('button', 'Lag møte').should('not.be.disabled').click();

    fieldErrors().should('exist');

    fieldError('title').should('be.visible');
    fieldError('report').should('be.visible');
    fieldError('mazemapPoi').should('be.visible');

    fieldError('startTime').should('not.exist');
    fieldError('endTime').should('not.exist');
    fieldError('description').should('not.exist');

    setDatePickerTime('startTime', '20', '00');
    setDatePickerTime('endTime', '19', '30');

    fieldError('endTime').should('be.visible');

    setDatePickerTime('endTime', '20', '30');

    fieldError('endTime').should('not.exist');

    field('useMazemap').click();

    cy.contains('button', 'Lag møte').click();

    fieldError('location').should('be.visible');

    // remove validation errors
    field('title').type('test');
    fieldError('title').should('not.exist');

    selectEditor().type('test');
    fieldError('report').should('not.exist');

    field('location').type('test');
    fieldError('location').should('not.exist');

    fieldErrors().should('not.exist');
  });

  it('should create basic meeting', () => {
    cy.intercept('POST', '/api/v1/meetings/1/bulk_invite/').as(
      'inviteToMeeting'
    );

    cy.visit('/meetings/create');

    field('title').type('Test meeting');
    selectEditor().type('Meeting plan');
    setDatePickerTime('startTime', '10', '00');
    setDatePickerTime('endTime', '13', '37');
    field('useMazemap').click();
    field('location').type('Test location');
    selectFromSelectField('users', 'bedkom bedkom (bedkom)', 'bedkom');
    selectFromSelectField('reportAuthor', 'bedkom bedkom', 'bedkom');
    selectFromSelectField('groups', 'Arrkom');

    fieldError('title').should('not.exist');
    fieldError('report').should('not.exist');
    fieldError('startTime').should('not.exist');
    fieldError('endTime').should('not.exist');
    fieldError('location').should('not.exist');
    fieldError('reportAuthor').should('not.exist');
    fieldError('users').should('not.exist');
    fieldError('groups').should('not.exist');

    cy.contains('button', 'Lag møte').click();

    cy.wait('@inviteToMeeting').then((interception) => {
      expect(interception.request.body).to.deep.eq({ groups: [4], users: [4] });
    });

    cy.contains('h1', 'Test meeting').should('be.visible');
    cy.contains('h3', '10:00').should('be.visible');
    cy.contains(c('legoEditor_disabled'), 'Meeting plan').should('be.visible');
    cy.contains('li', 'Når')
      .should('contain.text', '10:00 - 13:37')
      .should('be.visible');
    cy.contains('li', 'Sted')
      .should('contain.text', 'Test location')
      .should('be.visible');
    cy.contains('li', 'Forfatter')
      .should('contain.text', 'webkom webkom')
      .should('be.visible');
    cy.contains('li', 'Referent')
      .should('contain.text', 'bedkom bedkom')
      .should('be.visible');

    cy.contains(c('AttendanceStatus__poolBox'), 'Ikke svart')
      .should('contain.text', '2/2')
      .find('button')
      .click();

    cy.get(c('AttendanceModal__list'))
      .find(c('AttendanceModal__row'))
      .should('have.length', 2)
      .should('contain', 'bedkom bedkom')
      .should('contain', 'webkom webkom');

    cy.get(c('Modal__closeButton')).click();
  });

  it('should show correct options for referent', () => {
    cy.visit('/meetings/create');

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
      'Quinton'
    );
    verifyAuthors([
      'webkom webkom',
      'bedkom bedkom (bedkom)',
      'Quinton Armstrong (quintonarmstrong)',
    ]);
  });
});
