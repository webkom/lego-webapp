import React from 'react';
import expect from 'expect';
import { mount, shallow } from 'enzyme';
import CommentTree from '../CommentTree';
import comments from './fixtures/comments';
import { generateTreeStructure } from '../../utils';

describe('components', () => {
  describe('CommentTree', () => {
    const tree = generateTreeStructure(comments);

    it('should render the top level comments at root level ', () => {
      const wrapper = shallow(<CommentTree comments={tree} />);
      const commentElements = wrapper.find('.CommentTree__root');
      expect(commentElements.length).toEqual(2);
    });

    it('should nest comments', () => {
      const wrapper = mount(<CommentTree comments={tree} />);
      const rootElements = wrapper.find('.CommentTree__root');
      const rootElement = rootElements.at(1);
      const childTree = rootElement.find('.CommentTree__child');
      expect(childTree.html()).toContain(comments[2].text);
    });
  });
});
