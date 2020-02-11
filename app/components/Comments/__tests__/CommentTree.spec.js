import React from 'react';

import { mount, shallow } from 'enzyme';
import CommentTree from '../CommentTree';
import comments from './fixtures/comments';
import { generateTreeStructure } from '../../../utils';
import { MemoryRouter } from 'react-router-dom';

describe('<CommentTree />', () => {
  const tree = generateTreeStructure(comments);

  it('should render the top level comments at root level ', () => {
    const wrapper = shallow(<CommentTree comments={tree} />);
    const commentElements = wrapper.find('.root');
    expect(commentElements.length).toEqual(2);
  });

  it('should nest comments', () => {
    const wrapper = mount(
      <MemoryRouter>
        <CommentTree comments={tree} />
      </MemoryRouter>
    );
    const rootElements = wrapper.find('.root');
    const rootElement = rootElements.at(1);
    const childTree = rootElement.find('.child');
    expect(childTree.text()).toMatch(comments[2].text);
  });
});
