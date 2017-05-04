import React from 'react';
import QuoteRightNav from '../QuoteRightNav';
import { shallow } from 'enzyme';
import { createProps, createQuotes } from './fixtures/quotes';

const actionGrant = ['approve'];

describe('components', () => {
  describe('QuoteRightNav', () => {
    it('should link to unapproved quotes if current path is approved quotes', () => {
      const wrapper = shallow(
        <QuoteRightNav
          {...createProps()}
          quotes={createQuotes}
          actionGrant={actionGrant}
          detail={false}
        />
      );
      const link = wrapper.find('[to="/quotes?filter=unapproved"]');
      expect(link.exists()).toBe(true);
      expect(link.contains('Ikke godkjente sitater')).toBe(true);
    });

    it('should link to approved quotes if current path is unapproved quotes', () => {
      const wrapper = shallow(
        <QuoteRightNav
          {...createProps('unapproved')}
          quotes={createQuotes}
          actionGrant={actionGrant}
          detail={false}
        />
      );
      const link = wrapper.find('[to="/quotes"]');
      expect(link.exists()).toBe(true);
      expect(link.contains('Godkjente sitater')).toBe(true);
    });
  });
});
