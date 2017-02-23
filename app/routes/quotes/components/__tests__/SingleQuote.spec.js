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

describe('components', () => {
  describe('SingleQuote', () => {
    it('should notice that like is clicked and recieve correct quoteId', () => {
      const like = jest.fn();
      const wrapper = shallow(
        <Quote {...emptyProps()} like={like} quote={singleQuote()} />
      );
      const likeButton = wrapper.find('.quote-likes');

      expect(likeButton.exists()).toBe(true);
      likeButton.simulate('click');
      // Will fail if the id of the first fixture quote is changed
      expect(like).toBeCalledWith(quotes[0].id);
    });

    it('should notice that unlike is clicked and recieve correct quoteId', () => {
      const unlike = jest.fn();
      const wrapper = shallow(
        <Quote {...emptyProps()} unlike={unlike} quote={singleQuote(true)} />
      );
      wrapper.find('.quote-unlikes').simulate('click');
      expect(unlike).toBeCalledWith(quotes[0].id);
    });

    it('should notice that approve is clicked and recieve correct quoteId', () => {
      const approve = jest.fn();
      const wrapper = shallow(
        <Quote {...emptyProps()} approve={approve} quote={singleQuote(false, false)} />
      );
      const approveButton = wrapper.find('.quoteAdmin').children().at(0);
      approveButton.simulate('click');
      expect(approve).toBeCalledWith(quotes[0].id);
    });

    it('should notice that unapprove is clicked and recieve correct quoteId', () => {
      const unapprove = jest.fn();
      const wrapper = shallow(
        <Quote {...emptyProps()} unapprove={unapprove} quote={singleQuote(false, true, 1)} />
      );
      const approveButton = wrapper.find('.quoteAdmin').children().at(0);
      approveButton.simulate('click');
      expect(unapprove).toBeCalledWith(quotes[1].id);
    });

    it('should notice that delete is clicked and recieve correct quoteId', () => {
      const deleteQuote = jest.fn();
      const wrapper = shallow(
        <Quote {...emptyProps()} deleteQuote={deleteQuote} quote={singleQuote()} />
      );
      const deleteButton = wrapper.find('.quoteAdmin').children().at(1);
      deleteButton.simulate('click');
      expect(deleteQuote).toBeCalledWith(quotes[0].id);
    });
  });
});
