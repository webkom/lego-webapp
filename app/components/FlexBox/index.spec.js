import React from 'react';
import { shallow } from 'enzyme';
import { FlexRow, FlexColumn } from './';

describe('FlexBox', () => {
  describe('<FlexRow />', () => {
    it('should render with correct styles', () => {
      const wrapper = shallow(
        <FlexRow
          alignItems='center'
          justifyContent='center'
          className='TestContainer'
        />
      );

      expect(wrapper.props().style).to.contain({
        alignItems: 'center',
        justifyContent: 'center'
      });

      expect(wrapper.props().className).to.contain('TestContainer');
    });
  });

  describe('<FlexColumn />', () => {
    it('should render with correct styles', () => {
      const wrapper = shallow(
        <FlexColumn
          alignItems='center'
          justifyContent='center'
          className='TestContainer'
        />
      );

      expect(wrapper.props().style).to.contain({
        alignItems: 'center',
        justifyContent: 'center'
      });

      expect(wrapper.props().className).to.contain('TestContainer');
    });
  });
});
