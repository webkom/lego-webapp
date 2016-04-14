import React from 'react';
import expect from 'expect';
import SingleQuote from '../SingleQuote';
import { shallow } from 'enzyme';
import { singleQuote, quotes } from './fixtures/quotes';

const emptyProps = (rm) => ({
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
      const like = expect.createSpy();
      const wrapper = shallow(
        <SingleQuote {...emptyProps()} like={like} quote={singleQuote()} />
      );
      const likeButton = wrapper.find('.quote-likes');

      expect(likeButton.isEmpty()).toBe(false);
      likeButton.simulate('click');
      // Will fail if the id of the first fixture quote is changed
      expect(like).toHaveBeenCalledWith(quotes[0].id);
    });

    it('should notice that unlike is clicked and recieve correct quoteId', () => {
      const unlike = expect.createSpy();
      const wrapper = shallow(
        <SingleQuote {...emptyProps()} unlike={unlike} quote={singleQuote(true)} />
      );
      wrapper.find('.quote-unlikes').simulate('click');
      expect(unlike).toHaveBeenCalledWith(quotes[0].id);
    });

    it('should notice that approve is clicked and recieve correct quoteId', () => {
      const approve = expect.createSpy();
      const wrapper = shallow(
        <SingleQuote {...emptyProps()} approve={approve} quote={singleQuote(false, false)} />
      );
      const approveButton = wrapper.find('.quote-admin').children().at(0);
      approveButton.simulate('click');
      expect(approve).toHaveBeenCalledWith(quotes[0].id);
    });

    it('should notice that unapprove is clicked and recieve correct quoteId', () => {
      const unapprove = expect.createSpy();
      const wrapper = shallow(
        <SingleQuote {...emptyProps()} unapprove={unapprove} quote={singleQuote(false, true, 1)} />
      );
      const approveButton = wrapper.find('.quote-admin').children().at(0);
      approveButton.simulate('click');
      expect(unapprove).toHaveBeenCalledWith(quotes[1].id);
    });

    it('should notice that delete is clicked and recieve correct quoteId', () => {
      const deleteQuote = expect.createSpy();
      const wrapper = shallow(
        <SingleQuote {...emptyProps()} deleteQuote={deleteQuote} quote={singleQuote()} />
      );
      const deleteButton = wrapper.find('.quote-admin').children().at(1);
      deleteButton.simulate('click');
      expect(deleteQuote).toHaveBeenCalledWith(quotes[0].id);
    });
  });
});
