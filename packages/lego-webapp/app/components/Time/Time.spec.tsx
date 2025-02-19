import { shallow } from 'enzyme';
import moment from 'moment-timezone';
import { describe, it, expect, vi } from 'vitest';
import Time, { FromToTime, FormatTime } from '../Time';

vi.mock('app/config', async () => {
  return {
    default: {
      timezone: 'GMT',
    },
  };
});
describe('<Time />', () => {
  it('should show a date with a default format', () => {
    const dateTime = '2016-02-02T22:17:21.838103Z';
    const wrapper = shallow(<Time time={dateTime} />);
    const expected = <time dateTime={dateTime}>2016-02-2</time>;
    expect(wrapper.contains(expected)).toBe(true);
  });
  it('should show a date with a custom format', () => {
    const dateTime = '2016-02-02T22:17:21.838103Z';
    const wrapper = shallow(<Time format="HH:mm" time={dateTime} />);
    const expected = <time dateTime={dateTime}>22:17</time>;
    expect(wrapper.contains(expected)).toBe(true);
  });
  it('should show a readable date', () => {
    const dateTime = '2016-02-02T22:17:21.838103Z';
    const wrapper = shallow(<Time dateTime={dateTime} wordsAgo />);
    const time = wrapper.find('time');
    expect(time.prop('dateTime')).toEqual(dateTime);
    expect(time.prop('children')).toContain('ago'); // "for 3 dager siden"
  });
});
describe('<FormatTime />', () => {
  it('should render the year if it doesnt equal the current year', () => {
    const dateTime = '2016-01-18T20:00:00Z';
    const wrapper = shallow(<FormatTime time={dateTime} />);
    const time = wrapper.find(Time);
    const format = 'dddd DD. MMM YYYY HH:mm';
    expect(time.prop('time')).toEqual(moment(dateTime));
    expect(time.prop('format')).toEqual(format);
  });
  it('should not render the year if it equals the current year', () => {
    const currentYear = moment().format('YYYY');
    const dateTime = `${currentYear}-01-18T20:00:00Z`;
    const wrapper = shallow(<FormatTime time={dateTime} />);
    const time = wrapper.find('Time');
    const format = 'dddd DD. MMM HH:mm';
    expect(time.prop('time')).toEqual(moment(dateTime));
    expect(time.prop('format')).toEqual(format);
  });
});
describe('<FromToTime />', () => {
  it('should only render day once when start day == end day', () => {
    const from = '2016-01-18T20:00:00Z';
    const to = '2016-01-18T22:00:00Z';
    const output = 'Monday 18. Jan 2016 20:00 - 22:00';
    const wrapper = shallow(<FromToTime from={from} to={to} />);
    expect(wrapper.render().text()).toEqual(output);
  });
  it('should render both days fully when start day != end day', () => {
    const from = '2016-01-18T20:00:00Z';
    const to = '2016-01-19T22:00:00Z';
    const output = 'Mo 18. Jan 2016 20:00 - Tu 19. Jan 2016 22:00';
    const wrapper = shallow(<FromToTime from={from} to={to} />);
    expect(wrapper.render().text()).toEqual(output);
  });
  it('should render only one day fully if end - start < 1 day', () => {
    const from = '2016-01-18T20:00:00Z';
    const to = '2016-01-19T02:00:00Z';
    const output = 'Monday 18. Jan 2016 20:00 - 02:00';
    const wrapper = shallow(<FromToTime from={from} to={to} />);
    expect(wrapper.render().text()).toEqual(output);
  });
  it('should not render year if year == currentYear', () => {
    const from = '2017-01-18T20:00:00Z';
    const to = '2017-01-19T22:00:00Z';
    const output = 'We 18. Jan, 20:00 - Th 19. Jan, 22:00';
    const _now = Date.now;
    const mockDate = +moment(from);
    Date.now = vi.fn(() => mockDate);

    try {
      const wrapper = shallow(<FromToTime from={from} to={to} />);
      expect(wrapper.render().text()).toEqual(output);
    } finally {
      Date.now = _now;
    }
  });
  it('should not render year if year == currentYear, and day only once if equal', () => {
    const from = '2017-01-18T20:00:00Z';
    const to = '2017-01-18T21:00:00Z';
    const output = 'Wednesday 18. Jan, 20:00 - 21:00';
    const _now = Date.now;
    const mockDate = +moment(from);
    Date.now = vi.fn(() => mockDate);

    try {
      const wrapper = shallow(<FromToTime from={from} to={to} />);
      expect(wrapper.render().text()).toEqual(output);
    } finally {
      Date.now = _now;
    }
  });
});
