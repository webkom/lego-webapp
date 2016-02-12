import React from 'react';
import expect from 'expect';
import SingleQuote from '../SingleQuote';
import { shallow } from 'enzyme';
import createQuote from './fixtures/quotes';

const emptyProps = rm => ({
  // Just to remove warnings from npm test
  like: () => ({}),
  unlike: () => ({}),
  approve: () => ({}),
  unapprove: () => ({}),
  deleter: () => ({})
});

describe('components', () => {
  describe('SingleQuote', () => {
    it('should notice that like is clicked and recieve correct quoteId', () => {
      const like = expect.createSpy();
      const wrapper = shallow(
        <SingleQuote {...emptyProps()} like={like} quote={createQuote()[0]} />
      );
      const likeButton = wrapper.find('.likeFunc');
      expect(likeButton.isEmpty()).toBe(false);
      likeButton.simulate('click');
      // Will fail if the id of the first fixture quote is changed
      expect(like).toHaveBeenCalledWith(1);
    });

    it('should notice that unlike is clicked and recieve correct quoteId', () => {
      const unlike = expect.createSpy();
      const wrapper = shallow(
        <SingleQuote {...emptyProps()} unlike={unlike} quote={createQuote(true)[0]} />
      );
      wrapper.find('.likeFunc').simulate('click');
      expect(unlike).toHaveBeenCalledWith(1);
    });

    it('should notice that approve is clicked and recieve correct quoteId', () => {
      const approve = expect.createSpy();
      const wrapper = shallow(
        <SingleQuote {...emptyProps()} approve={approve} quote={createQuote(false, false)[0]} />
      );
      wrapper.find('.approve-it').simulate('click');
      expect(approve).toHaveBeenCalledWith(1);
    });

    it('should notice that unapprove is clicked and recieve correct quoteId', () => {
      const unapprove = expect.createSpy();
      const wrapper = shallow(
        <SingleQuote {...emptyProps()} unapprove={unapprove} quote={createQuote()[0]} />
      );
      wrapper.find('.approve-it').simulate('click');
      expect(unapprove).toHaveBeenCalledWith(1);
    });

    it('should notice that delete is clicked and recieve correct quoteId', () => {
      const deleter = expect.createSpy();
      const wrapper = shallow(
        <SingleQuote {...emptyProps()} deleter={deleter} quote={createQuote()[0]} />
      );
      wrapper.find('.delete').simulate('click');
      expect(deleter).toHaveBeenCalledWith(1);
    });
  });
});
