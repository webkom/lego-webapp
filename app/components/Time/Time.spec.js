import React from 'react';

import Time from '../Time';
import { shallow } from 'enzyme';

describe('<Time />', () => {
  it('should show a date with a default format', () => {
    const dateTime = '2016-02-02T22:17:21.838103Z';
    const wrapper = shallow(<Time time={dateTime} />);
    const expected = (
      <time dateTime={dateTime}>
        2016-02-2
      </time>
    );
    expect(wrapper.contains(expected)).toEqual(true);
  });

  it('should show a date with a custom format', () => {
    const dateTime = '2016-02-02T22:17:21.838103Z';
    const wrapper = shallow(<Time format={'HH:mm'} time={dateTime} />);
    const expected = (
      <time dateTime={dateTime}>
        23:17
      </time>
    );
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
