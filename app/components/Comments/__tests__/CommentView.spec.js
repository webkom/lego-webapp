import { shallow } from 'enzyme';
import CommentView from '../CommentView';
import CommentTree from '../CommentTree';
import comments from './fixtures/comments';

describe('components', () => {
  describe('CommentView', () => {
    it('should render a comment tree', () => {
      const wrapper = shallow(<CommentView comments={comments} />);
      expect(wrapper.find(CommentTree).length).toEqual(1);
    });

    it('should pass the comment tree a tree structure', () => {
      const wrapper = shallow(<CommentView comments={comments} />);
      const tree = wrapper.find(CommentTree).props().comments;
      const [first, second] = tree;
      expect(first.children.length).toEqual(0);
      expect(second.children.length).toEqual(1);
      expect(second.children[0].parent).toEqual(second.id);
    });
  });
});
