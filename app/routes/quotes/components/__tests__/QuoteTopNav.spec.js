import React from 'react';
import QuoteTopNav from '../QuoteTopNav';
import { shallow } from 'enzyme';
import { createQuotes } from './fixtures/quotes';

const props = {
  routeParams: {
    filter: undefined
  },
  route: {
    path: 'quotes'
  }
};

const emptyProps = () => ({
  // Just to remove warnings from npm test
  query: {},
  sortType: ''
});

describe('components', () => {
  describe('QuoteTopNav', () => {
    it('should show sort icons if page is a list of approved/unapproved quotes', () => {
      const wrapper = shallow(
        <QuoteTopNav {...emptyProps()} {...props} quotes={createQuotes} />
      );
      expect(wrapper.find('.sortQuote').exists()).toBe(true);
    });
  });
});
