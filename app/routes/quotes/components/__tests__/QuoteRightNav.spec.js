import React from 'react';
import expect from 'expect';
import QuoteRightNav from '../QuoteRightNav';
import { shallow } from 'enzyme';
import { createProps, createQuotes } from './fixtures/quotes';

describe('components', () => {
  describe('QuoteRightNav', () => {
    it('should link to unapproved quotes if current path is approved quotes', () => {
      const wrapper = shallow(
        <QuoteRightNav {...createProps()} quotes={createQuotes} />
      );
      const link = wrapper.find('[to="/quotes?filter=unapproved"]');
      expect(link.isEmpty()).toBe(false);
      expect(link.contains('Ikke godkjente sitater')).toBe(true);
    });

    it('should link to approved quotes if current path is unapproved quotes', () => {
      const wrapper = shallow(
        <QuoteRightNav {...createProps('unapproved')} quotes={createQuotes} />
      );
      const link = wrapper.find('[to="/quotes"]');
      expect(link.isEmpty()).toBe(false);
      expect(link.contains('Godkjente sitater')).toBe(true);
    });
  });
});
