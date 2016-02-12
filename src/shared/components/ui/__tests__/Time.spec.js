import React from 'react';
import expect from 'expect';
import Time from '../Time';
import { shallow } from 'enzyme';

describe('components', () => {
  describe('ui/Time', () => {
    it('should show a date with a default format', () => {
      const dateTime = '2016-02-02T22:17:21.838103Z';
      const wrapper = shallow(<Time time={dateTime} />);
      const expected = (
        <time dateTime={dateTime}>
          2016-02-2
        </time>
      );

      expect(wrapper.equals(expected)).toBe(true);
    });

    it('should show a date with a custom format', () => {
      const dateTime = '2016-02-02T22:17:21.838103Z';
      const wrapper = shallow(<Time format={'HH:mm'} time={dateTime} />);
      const expected = (
        <time dateTime={dateTime}>
          23:17
        </time>
      );

      expect(wrapper.equals(expected)).toBe(true);
    });
  });
});
