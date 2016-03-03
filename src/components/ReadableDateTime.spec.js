import React from 'react';
import expect from 'expect';
import ReadableDateTime from '../ReadableDateTime';
import { shallow } from 'enzyme';

describe('components', () => {
  describe('ui/ReadableDateTime', () => {
    it('should show a readable date', () => {
      const dateTime = '2016-02-02T22:17:21.838103Z';
      const wrapper = shallow(<ReadableDateTime dateTime={dateTime} />);
      const time = wrapper.find('time');
      expect(time.prop('dateTime')).toEqual(dateTime);
      expect(time.prop('children')).toContain('siden'); // "for 3 dager siden"
    });
  });
});
