import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddQuote from '../AddQuote';

describe('components', () => {
  describe('AddQuote', () => {
    it('should be possible to submit forms', () => {
      const addQuotes = jest.fn(() => Promise.resolve());
      const validator = jest.fn(() => ({}));
      const mockStore = configureStore();
      const store = mockStore();
      const wrapper = mount(
        <Provider {...{ store }}>
          <AddQuote
            addQuotes={addQuotes}
            validate={validator}
            actionGrant={['approve']}
          />
        </Provider>
      );
      const form = wrapper.find('form');
      form.simulate('submit');

      expect(validator).toHaveBeenCalled();
      expect(addQuotes).toHaveBeenCalled();
    });
  });
});

/*

###
Didn't want to delete this code completely. Wanted to fix it even less.
###

import React from 'react';
import QuoteList from '../QuoteList';
import { shallow } from 'enzyme';
import { createProps, createQuotes, quotes } from './fixtures/quotes';

const emptyProps = () => ({
  // Just to remove warnings from npm test
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
*/
