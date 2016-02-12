import React from 'react';
import expect from 'expect';
import QuoteList from '../QuoteList';
import { shallow } from 'enzyme';
import createQuote from './fixtures/quotes';
import { createProps } from './fixtures/quotes';

const emptyProps = () => ({
  // Just to remove warnings from npm test
  like: () => ({}),
  unlike: () => ({}),
  approve: () => ({}),
  unapprove: () => ({}),
  deleter: () => ({}),
  sortType: ''
});

describe('components', () => {
  describe('QuoteList', () => {
    it('should display all the quotes if route is root', () => {
      const wrapper = shallow(
        <QuoteList {...createProps()} {...emptyProps()} quotes={createQuote()} />
      );
      expect(wrapper.find('.quotes').children().length === createQuote().length).toBe(true);
    });
  });
});
