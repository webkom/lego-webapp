import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddQuote from '../AddQuote';

describe('components', () => {
  describe('AddQuote', () => {
    it('should be possible to submit forms', () => {
      const addQuotes = jest.fn();
      const validator = jest.fn(() => ({}));
      const mockStore = configureStore();
      const store = mockStore();
      const wrapper = mount(
        <Provider {...{ store }}>
          <AddQuote addQuotes={addQuotes} validate={validator} />
        </Provider>
      );
      const form = wrapper.find('form');
      form.simulate('submit');

      expect(validator).toHaveBeenCalled();
      expect(addQuotes).toHaveBeenCalled();
    });
  });
});
