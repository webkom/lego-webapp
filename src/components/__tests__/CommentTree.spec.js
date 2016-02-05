import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import CommentTree from '../CommentTree';
import comments from './fixtures/comments';
import { generateTreeStructure } from '../../utils';

describe('components', () => {
  describe('CommentTree', () => {
    const tree = generateTreeStructure(comments);

    it('should render the top level comments at root level ', () => {
      const wrapper = shallow(<CommentTree comments={tree} />);
      const commentElements = wrapper.children();
      expect(commentElements.children().length).toEqual(2);
    });

    it('should nest comments', () => {
      const wrapper = shallow(<CommentTree comments={tree} />);
      const rootElements = wrapper.find('.CommentTree').children();
      const rootElement = rootElements.at(0);
      const childTree = rootElements.at(1);
      expect(rootElement.prop('comment')).toEqual(tree[1]);
      expect(childTree.prop('comments')).toEqual(tree[1].children);
    });
  });
});
