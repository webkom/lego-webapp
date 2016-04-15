import React from 'react';
import expect from 'expect';
import QuoteList from '../QuoteList';
import { shallow } from 'enzyme';
import { createProps, createQuotes, quotes } from './fixtures/quotes';

const emptyProps = () => ({
  // Just to remove warnings from npm test
  like: () => ({}),
  unlike: () => ({}),
  approve: () => ({}),
  unapprove: () => ({}),
  deleteQuote: () => ({}),
  sortType: ''
});

describe('components', () => {
  describe('QuoteList', () => {
    it('should display all the quotes if route is root', () => {
      const wrapper = shallow(
        <QuoteList {...createProps()} {...emptyProps()} quotes={createQuotes} />
      );
      const foundQuotes = wrapper.find('ul').children();
      expect(foundQuotes.length).toEqual(quotes.length);
    });
  });
});
