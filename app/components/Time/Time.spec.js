import React from 'react';

import Time, { FromToTime, FormatTime } from '../Time';
import { shallow } from 'enzyme';
import moment from 'moment-timezone';

describe('<Time />', () => {
  it('should show a date with a default format', () => {
    const dateTime = '2016-02-02T22:17:21.838103Z';
    const wrapper = shallow(<Time time={dateTime} />);
    const expected = <time dateTime={dateTime}>2016-02-2</time>;
    expect(wrapper.contains(expected)).toEqual(true);
  });

  it('should show a date with a custom format', () => {
    const dateTime = '2016-02-02T22:17:21.838103Z';
    const wrapper = shallow(<Time format={'HH:mm'} time={dateTime} />);
    const expected = <time dateTime={dateTime}>23:17</time>;
    expect(wrapper.contains(expected)).toEqual(true);
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

    const wrapper = shallow(<FromToTime from={from} to={to} />);
    const time = wrapper.find('span');

    const fromTime = (
      <FormatTime time={moment(from)} format="dddd DD. MMMM, HH:mm" />
    );
    const toTime = <FormatTime time={moment(to)} format="HH:mm" />;

    expect(time.prop('children')[0]).toEqual(fromTime);
    expect(time.prop('children')[3]).toEqual(toTime);
  });

  it('should render both days fully when start day != end day', () => {
    const from = '2016-01-18T20:00:00Z';
    const to = '2016-01-19T22:00:00Z';

    const wrapper = shallow(<FromToTime from={from} to={to} />);
    const time = wrapper.find('span');

    const fromTime = <FormatTime time={moment(from)} />;
    const toTime = <FormatTime time={moment(to)} />;

    expect(time.prop('children')[0]).toEqual(fromTime);
    expect(time.prop('children')[2]).toEqual(toTime);
  });
});
