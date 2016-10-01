import React from 'react';
import AddQuote from '../AddQuote';
import { mount } from 'enzyme';
import configureStore from 'app/utils/configureStore';
import { Provider } from 'react-redux';


describe('components', () => {
  describe('AddQuote', () => {
    it('should be possible to submit forms', () => {
      const addQuotes = jest.fn();
      const validator = jest.fn(() => ({}));
      const store = configureStore();
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
