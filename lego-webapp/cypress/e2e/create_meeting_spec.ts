import moment from 'moment-timezone';
import 'moment/locale/nb';
import config from '~/cypress/support/config';
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
} from '~/cypress/support/utils';

describe('Create meeting', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.cachedLogin();
  });

  it('should show correct validation errors', () => {
    cy.visit('/meetings/new');
    cy.waitForHydration();
    // Check that validation errors show only after we try to submit
    fieldErrors().should('not.exist');

    // verify initial values are set
    field('useMazemap').should('be.checked');
    field('date').should('not.have.value', '');

    cy.contains('button', 'Opprett møte').should('be.disabled');
    // change the meeting time to enable submit button
    field('date').click();
    cy.get(t('time-picker-input') + ' ' + c('_arrowUp'))
      .first()
      .click();
    cy.contains('Nytt møte').click(); // Click on something to close the datepicker

    cy.contains('button', 'Opprett møte').should('not.be.disabled').click();

    fieldErrors().should('exist');

    fieldError('title').should('be.visible');
    fieldError('report').should('be.visible');
    fieldError('mazemapPoi').should('be.visible');

    fieldError('date').should('not.exist');
    fieldError('description').should('not.exist');

    setDatePickerTime('date', '19', '30', false);
    setDatePickerTime('date', '20', '00', true);

    fieldError('date').should('not.exist');
    field('date').should('contain.value', '19:30');
    field('date').should('contain.value', '20:00');

    setDatePickerTime('date', '20', '30', true);

    fieldError('date').should('not.exist');

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
      'inviteToMeeting',
    );

    cy.visit('/meetings/new');
    cy.waitForHydration();

    field('title').type('Test meeting');
    selectEditor().type('Meeting plan');
    setDatePickerTime('date', '10', '00', false);
    setDatePickerTime('date', '13', '37', true);
    field('useMazemap').click();
    field('location').type('Test location');
    selectFromSelectField('users', 'bedkom bedkom (bedkom)', 'bedkom');
    selectFromSelectField('reportAuthor', 'bedkom bedkom', 'bedkom');
    selectFromSelectField('groups', 'Arrkom');

    fieldError('title').should('not.exist');
    fieldError('report').should('not.exist');
    fieldError('date').should('not.exist');
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
    cy.contains(t('lego-editor-content'), 'Meeting plan').should('be.visible');
    cy.contains('div', 'Når')
      .should('contain.text', '10:00 - 13:37')
      .should('be.visible');
    cy.contains('div', 'Sted')
      .should('contain.text', 'Test location')
      .should('be.visible');
    cy.contains('div', 'Forfatter')
      .should('contain.text', 'webkom webkom')
      .should('be.visible');
    cy.contains('div', 'Referent')
      .should('contain.text', 'bedkom bedkom')
      .should('be.visible');

    cy.contains(t('pool-box'), 'Ikke svart')
      .should('contain.text', '2/2')
      .find('button')
      .click();

    cy.get(t('attendance-modal-content') + ' ' + c('_list'))
      .find(c('_row'))
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
      'inviteToMeeting',
    );

    cy.visit('/meetings');
    cy.waitForHydration();

    cy.contains('h3', meeting.title).click();

    cy.contains('a', 'Rediger').click();

    field('title').should('have.value', meeting.title);
    selectEditor().should('contain', meeting.report.replaceAll(/<.*?>/g, ''));
    field('date').should(
      'have.value',
      moment(meeting.startTime).format('lll') +
        ' - ' +
        moment(meeting.endTime).format('lll'),
    );
    field('description').should('have.value', meeting.description);
    field('location').should('have.value', meeting.location);
    selectField('reportAuthor').should('contain.text', 'webkom webkom');

    // verify invited users modal
    cy.get(t('pool-box')).find('button').click();
    cy.contains(
      t('attendance-modal-content') + ' ' + c('_row'),
      'webkom webkom',
    ).should('be.visible');
    cy.get(t('Modal__closeButton')).click();

    setDatePickerTime('date', '17', '15', false);
    setDatePickerTime('date', '20', '00', true);
    field('useMazemap').click();
    selectFromSelectField('mazemapPoi', 'Abakus, Realfagbygget', 'abakus');
    selectFromSelectField('users', 'bedkom bedkom (bedkom)', 'bedkom');

    selectEditor().type('{enter}{enter}Meeting report');

    fieldError('title').should('not.exist');
    fieldError('report').should('not.exist');
    fieldError('date').should('not.exist');
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
    cy.contains(t('lego-editor-content'), 'Meeting plan').should('be.visible');
    cy.contains(t('lego-editor-content'), 'Meeting report').should(
      'be.visible',
    );
    cy.contains('div', 'Når')
      .should('contain.text', '17:15 - 20:00')
      .should('be.visible');
    cy.contains('div', 'Sted')
      .should('contain.text', 'Abakus, Realfagbygget')
      .should('be.visible');
    cy.contains('div', 'Forfatter')
      .should('contain.text', 'webkom webkom')
      .should('be.visible');
    cy.contains('div', 'Referent')
      .should('contain.text', 'webkom webkom')
      .should('be.visible');

    cy.contains(t('pool-box'), 'Ikke svart')
      .should('contain.text', '2/2')
      .find('button')
      .click();

    cy.get(t('attendance-modal-content') + ' ' + c('_list'))
      .find(c('_row'))
      .should('have.length', 2)
      .should('contain', 'bedkom bedkom')
      .should('contain', 'webkom webkom');

    cy.get(t('Modal__closeButton')).click();
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
