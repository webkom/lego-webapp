import React from 'react';
import expect from 'expect';
import QuoteTopNav from '../QuoteTopNav';
import { shallow } from 'enzyme';
import { createQuotes } from './fixtures/quotes';

const props = ({
  routeParams: {
    filter: undefined
  },
  route: {
    path: 'quotes'
  }
});

const emptyProps = () => ({
  // Just to remove warnings from npm test
  setSortType: () => ({}),
  sortType: ''
});

describe('components', () => {
  describe('QuoteTopNav', () => {
    it('should show sort icons if page is a list of approved/unapproved quotes', () => {
      const wrapper = shallow(<QuoteTopNav {...emptyProps()} {...props} quotes={createQuotes} />);
      expect(wrapper.find('.sort-quote').isEmpty()).toBe(false);
    });

    it('should NOT show sort icons if route is a single quote', () => {
      const propsCopy = { ...props, routeParams: { filter: 1 } };
      const wrapper = shallow(
        <QuoteTopNav {...emptyProps()} {...propsCopy} quotes={createQuotes} />
      );
      expect(wrapper.find('.sort-quote').isEmpty()).toBe(true);
    });
  });
});
