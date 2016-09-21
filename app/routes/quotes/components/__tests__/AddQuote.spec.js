import React from 'react';
import AddQuote from '../AddQuote';
import { mount } from 'enzyme';

const emptyProps = () => ({
  // Just to remove warnings from npm test
  fields: {
    text: {},
    source: {}
  },
  invalid: true,
  pristine: true,
  submitting: false
});

describe('components', () => {
  describe('AddQuote', () => {
    it('should be possible to submit forms', () => {
      const addQuotes = jest.fn();
      const wrapper = mount(
        <AddQuote addQuotes={addQuotes} {...emptyProps()} />
      );
      const form = wrapper.find('form');
      form.simulate('submit');
      expect(addQuotes).toHaveBeenCalled();
    });
  });
});
