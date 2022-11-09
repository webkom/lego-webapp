import { shallow } from 'enzyme';
import CommentTree from '../CommentTree';
import CommentView from '../CommentView';
import comments from './fixtures/comments';

describe('components', () => {
  describe('CommentView', () => {
    it('should render a comment tree', () => {
      const wrapper = shallow(<CommentView comments={comments} />);
      expect(wrapper.find(CommentTree)).toHaveLength(1);
    });
    it('should pass the comment tree a tree structure', () => {
      const wrapper = shallow(<CommentView comments={comments} />);
      const tree = wrapper.find(CommentTree).props().comments;
      const [first, second] = tree;
      expect(first.children).toHaveLength(0);
      expect(second.children).toHaveLength(1);
      expect(second.children[0].parent).toEqual(second.id);
    });
  });
});
