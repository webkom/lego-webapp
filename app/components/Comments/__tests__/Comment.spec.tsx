import { shallow } from 'enzyme';
import { describe, it, expect } from 'vitest';
import Comment from '../Comment';
import type CommentType from 'app/store/models/Comment';

const comment: CommentType = {
  id: 1,
  text: 'this is a nice comment',
  createdAt: '2016-02-02T22:17:21.838103Z',
  updatedAt: '2016-02-02T22:17:21.838103Z',
  contentTarget: 'event-1',
  author: {
    id: 1,
    username: 'cat',
    fullName: 'Cat Catson',
    gender: 'female',
    firstName: 'Cat',
    lastName: 'Catson',
    profilePicture: 'picture',
  },
  parent: null,
};
describe('components', () => {
  describe('Comment', () => {
    it('should show a comment', () => {
      // eslint-disable-next-line
      // @ts-ignore
      const wrapper = shallow(<Comment comment={comment} />);
      expect(wrapper.contains(comment.author.fullName)).toBe(true);
      expect(wrapper.find('#comment-text').html()).toContain(comment.text);
    });
  });
});
