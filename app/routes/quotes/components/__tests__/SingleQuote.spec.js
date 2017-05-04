import React from 'react';
import Quote from '../Quote';
import { shallow } from 'enzyme';
import { singleQuote, quotes } from './fixtures/quotes';

const emptyProps = () => ({
  // Just to remove warnings from npm test
  like: () => ({}),
  unlike: () => ({}),
  approve: () => ({}),
  unapprove: () => ({}),
  deleteQuote: () => ({})
});

const actionGrant = ['approve'];

describe('components', () => {
  describe('SingleQuote', () => {
    it('should notice that approve is clicked and recieve correct quoteId', () => {
      const approve = jest.fn();
      const wrapper = shallow(
        <Quote
          {...emptyProps()}
          approve={approve}
          quote={singleQuote(false, false)}
          actionGrant={actionGrant}
        />
      );
      const approveButton = wrapper.find('.quoteAdmin').children().at(0);
      approveButton.simulate('click');
      expect(approve).toBeCalledWith(quotes[0].id);
    });

    it('should notice that unapprove is clicked and recieve correct quoteId', () => {
      const unapprove = jest.fn();
      const wrapper = shallow(
        <Quote
          {...emptyProps()}
          unapprove={unapprove}
          quote={singleQuote(false, true, 1)}
          actionGrant={actionGrant}
        />
      );
      const approveButton = wrapper.find('.quoteAdmin').children().at(0);
      approveButton.simulate('click');
      expect(unapprove).toBeCalledWith(quotes[1].id);
    });

    it('should notice that delete is clicked and recieve correct quoteId', () => {
      const deleteQuote = jest.fn();
      const wrapper = shallow(
        <Quote
          {...emptyProps()}
          deleteQuote={deleteQuote}
          quote={singleQuote()}
          actionGrant={actionGrant}
        />
      );
      const deleteButton = wrapper.find('.quoteAdmin').children().at(1);
      deleteButton.simulate('click');
      expect(deleteQuote).toBeCalledWith(quotes[0].id);
    });
  });
});
