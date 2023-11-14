import moment from 'moment-timezone';
import config from '../support/config';
import {
  c,
  t,
  field,
  fieldError,
  fieldErrors,
  mockMazemapApi,
  selectEditor,
  setDatePickerTime,
  selectFromSelectField,
  selectFieldDropdown,
  selectField,
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

    cy.contains('button', 'Opprett møte').should('be.disabled');
    // change the meeting time to enable submit button
    field('startTime').click();
    cy.get(c('TimePicker__arrowUp')).first().click();
    cy.contains('Nytt møte').click(); // Click on something to close the datepicker

    cy.contains('button', 'Opprett møte').should('not.be.disabled').click();

    fieldErrors().should('exist');

    fieldError('title').should('be.visible');
    fieldError('report').should('be.visible');
    fieldError('mazemapPoi').should('be.visible');

    fieldError('startTime').should('not.exist');
    fieldError('endTime').should('not.exist');
    fieldError('description').should('not.exist');

    setDatePickerTime('endTime', '19', '30');
    setDatePickerTime('startTime', '20', '00');

    fieldError('endTime').should('not.exist');
    field('endTime').should('contain.value', '22:00');

    setDatePickerTime('endTime', '20', '30');

    fieldError('endTime').should('not.exist');

    field('useMazemap').click();

    cy.contains('button', 'Opprett møte').click();

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

    cy.contains('button', 'Opprett møte').click();

    cy.wait('@inviteToMeeting').then((interception) => {
      expect(interception.request.body).to.deep.eq({ groups: [4], users: [4] });
    });

    cy.contains('h1', 'Test meeting').should('be.visible');
    cy.contains('time', '10:00').should('be.visible');
    cy.contains(c('legoEditor_disabled'), 'Meeting plan').should('be.visible');
    cy.contains('tr', 'Når')
      .should('contain.text', '10:00 - 13:37')
      .should('be.visible');
    cy.contains('tr', 'Sted')
      .should('contain.text', 'Test location')
      .should('be.visible');
    cy.contains('tr', 'Forfatter')
      .should('contain.text', 'webkom webkom')
      .should('be.visible');
    cy.contains('tr', 'Referent')
      .should('contain.text', 'bedkom bedkom')
      .should('be.visible');

    cy.contains(c('AttendanceStatus__poolBox'), 'Ikke svart')
      .should('contain.text', '2/2')
      .find('button')
      .click();

    cy.get(c('AttendanceModalContent__list'))
      .find(c('AttendanceModalContent__row'))
      .should('have.length', 2)
      .should('contain', 'bedkom bedkom')
      .should('contain', 'webkom webkom');

    cy.get(t('Modal__closeButton')).click();
  });

  it('should edit meeting', () => {
    mockMazemapApi();
    moment.locale('nb-NO');

    const meeting = {
      title: 'Test meeting',
      report: '<p>Meeting plan</p>',
      description: 'test description',
      location: 'Test location',
      startTime: moment()
        .tz(config.timezone)
        .startOf('day')
        .add({ hours: 17, minutes: 14 })
        .toISOString(),
      endTime: moment()
        .tz(config.timezone)
        .startOf('day')
        .add({ hours: 20, minutes: 0 })
        .toISOString(),
      reportAuthor: 3,
      mazemapPoi: null,
    };

    cy.apiRequest({
      method: 'POST',
      url: '/api/v1/meetings/',
      body: JSON.stringify(meeting),
    });

    cy.intercept('POST', '/api/v1/meetings/1/bulk_invite/').as(
      'inviteToMeeting'
    );

    cy.visit('/meetings');

    cy.contains('h3', meeting.title).click();

    cy.contains('a', 'Rediger').click();

    field('title').should('have.value', meeting.title);
    selectEditor().should('contain', meeting.report.replaceAll(/<.*?>/g, ''));
    field('startTime').should(
      'have.value',
      moment(meeting.startTime).tz(config.timezone).format('lll')
    );
    field('endTime').should(
      'have.value',
      moment(meeting.endTime).tz(config.timezone).format('lll')
    );
    field('description').should('have.value', meeting.description);
    field('location').should('have.value', meeting.location);
    selectField('reportAuthor').should('contain.text', 'webkom webkom');

    // verify invited users modal
    cy.get(c('AttendanceStatus__poolBox')).find('button').click();
    cy.contains(c('AttendanceModalContent__row'), 'webkom webkom').should(
      'be.visible'
    );
    cy.get(t('Modal__closeButton')).click();

    setDatePickerTime('startTime', '17', '15');
    setDatePickerTime('endTime', '20', '00');
    field('useMazemap').click();
    selectFromSelectField('mazemapPoi', 'Abakus, Realfagbygget', 'abakus');
    selectFromSelectField('users', 'bedkom bedkom (bedkom)', 'bedkom');

    selectEditor().type('{enter}{enter}Meeting report');
    cy.wait(100); // wait for lego-editor debounce

    fieldError('title').should('not.exist');
    fieldError('report').should('not.exist');
    fieldError('startTime').should('not.exist');
    fieldError('endTime').should('not.exist');
    fieldError('location').should('not.exist');
    fieldError('reportAuthor').should('not.exist');
    fieldError('users').should('not.exist');
    fieldError('groups').should('not.exist');

    cy.contains('button', 'Lagre endringer').click();

    cy.wait('@inviteToMeeting').then((interception) => {
      expect(interception.request.body).to.deep.eq({ groups: [], users: [4] });
    });

    cy.contains('h1', meeting.title).should('be.visible');
    cy.contains('time', '17:15').should('be.visible');
    cy.contains(c('legoEditor_disabled'), 'Meeting plan').should('be.visible');
    cy.contains(c('legoEditor_disabled'), 'Meeting report').should(
      'be.visible'
    );
    cy.contains('tr', 'Når')
      .should('contain.text', '17:15 - 20:00')
      .should('be.visible');
    cy.contains('tr', 'Sted')
      .should('contain.text', 'Abakus, Realfagbygget')
      .should('be.visible');
    cy.contains('tr', 'Forfatter')
      .should('contain.text', 'webkom webkom')
      .should('be.visible');
    cy.contains('tr', 'Referent')
      .should('contain.text', 'webkom webkom')
      .should('be.visible');

    cy.contains(c('AttendanceStatus__poolBox'), 'Ikke svart')
      .should('contain.text', '2/2')
      .find('button')
      .click();

    cy.get(c('AttendanceModalContent__list'))
      .find(c('AttendanceModalContent__row'))
      .should('have.length', 2)
      .should('contain', 'bedkom bedkom')
      .should('contain', 'webkom webkom');

    cy.get(t('Modal__closeButton')).click();
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
