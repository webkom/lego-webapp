import moment from 'moment';
import { default as Time, FormatTime, FromToTime } from '../../components/Time';

describe('(<Time />', () => {
  const dateTime = '2016-02-02T22:17:21.838103Z';

  it('should show a date with a default format', () => {
    cy.mount(<Time time={dateTime} />);
    cy.get('time')
      .should('exist')
      .and('have.attr', 'dateTime', dateTime)
      .and('have.text', '2016-02-2');
  });

  it('should show a date with a custom format', () => {
    cy.mount(<Time format="HH:mm" time={dateTime} />);
    cy.get('time')
      .should('exist')
      .and('have.attr', 'dateTime', dateTime)
      .and('have.text', '23:17');
  });

  it('should show a readable date', () => {
    cy.mount(<Time dateTime={dateTime} wordsAgo />);
    cy.get('time')
      .should('exist')
      .and('have.attr', 'dateTime', dateTime)
      .and('contain.text', 'ago'); // "for 3 dager siden"
  });
});

describe('<FormatTime />', () => {
  it('should render the year if it doesnt equal the current year', () => {
    const dateTime = '2016-01-18T20:00:00Z';
    cy.mount(<FormatTime time={dateTime} />);
    cy.get('time')
      .should('exist')
      .and('have.attr', 'dateTime', moment(dateTime).toString())
      .and('have.text', moment(dateTime).format('dddd DD. MMM YYYY HH:mm'));
  });

  it('should not render the year if it equals the current year', () => {
    const currentYear = moment().format('YYYY');
    const dateTime = `${currentYear}-01-18T20:00:00Z`;
    cy.mount(<FormatTime time={dateTime} />);
    cy.get('time')
      .should('exist')
      .and('have.attr', 'dateTime', moment(dateTime).toString())
      .and('have.text', moment(dateTime).format('dddd DD. MMM HH:mm'));
  });
});

describe('<FromToTime />', () => {
  it('should only render day once when start day == end day', () => {
    const from = '2016-01-18T20:00:00Z';
    const to = '2016-01-18T22:00:00Z';
    const output = 'Monday 18. Jan 2016 21:00 - 23:00';
    cy.mount(<FromToTime from={from} to={to} />);
    cy.get('span').should('exist').and('contain.text', output);
  });
  it('should render both days fully when start day != end day', () => {
    const from = '2016-01-18T20:00:00Z';
    const to = '2016-01-19T22:00:00Z';
    const output = 'Mo 18. Jan 2016 21:00 - Tu 19. Jan 2016 23:00';
    cy.mount(<FromToTime from={from} to={to} />);
    cy.get('span').should('exist').and('contain.text', output);
  });
  it('should render only one day fully if end - start < 1 day', () => {
    const from = '2016-01-18T20:00:00Z';
    const to = '2016-01-19T02:00:00Z';
    const output = 'Monday 18. Jan 2016 21:00 - 03:00';
    cy.mount(<FromToTime from={from} to={to} />);
    cy.get('span').should('exist').and('contain.text', output);
  });
  it('should not render year if year == currentYear', () => {
    const from = '2017-01-18T20:00:00Z';
    const to = '2017-01-19T22:00:00Z';
    const output = 'We 18. Jan, 21:00 - Th 19. Jan, 23:00';

    const mockDate = +moment(from);
    cy.clock(mockDate);

    cy.mount(<FromToTime from={from} to={to} />);

    cy.get('span').should('exist').and('contain.text', output);
  });
  it('should not render year if year == currentYear, and day only once if equal', () => {
    const from = '2017-01-18T20:00:00Z';
    const to = '2017-01-18T21:00:00Z';
    const output = 'Wednesday 18. Jan, 21:00 - 22:00';

    const mockDate = +moment(from);
    cy.clock(mockDate);

    cy.mount(<FromToTime from={from} to={to} />);

    cy.get('span').should('exist').and('contain.text', output);
  });
});
