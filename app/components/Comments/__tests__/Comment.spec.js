import React from 'react';

import Comment from '../Comment';
import { shallow } from 'enzyme';

const comment = {
  id: 1,
  text: 'this is a nice comment',
  createdAt: '2016-02-02T22:17:21.838103Z',
  author: {
    id: 1,
    username: 'cat',
  },
};

describe('components', () => {
  describe('Comment', () => {
    it('should show a comment', () => {
      const wrapper = shallow(<Comment comment={comment} />);
      expect(wrapper.contains(comment.author.username)).toEqual(true);
      expect(wrapper.find('#comment-text').html()).toContain(comment.text);
    });
  });
});
