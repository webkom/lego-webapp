import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { generateTreeStructure } from 'app/utils';
import CommentTree from '../CommentTree';
import comments from './fixtures/comments';

const store = configureStore([])({
  theme: {
    theme: 'light',
  },
});

describe('<CommentTree />', () => {
  beforeAll(() => {
    // jest does not implement this function, so we just
    // stub it out. (this function is used by the editor, so it will
    // have no impact on these tests)
    // eslint-disable-next-line
    // @ts-ignore
    window.getSelection = () => {};
  });
  const tree = generateTreeStructure(comments);
  it('should render the top level comments at root level', () => {
    // eslint-disable-next-line
    // @ts-ignore
    const wrapper = shallow(<CommentTree comments={tree} />);
    const commentElements = wrapper.find('.root');
    expect(commentElements).toHaveLength(2);
  });
  it('should nest comments', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Provider store={store}>
          {/*eslint-disable*/}
          {/* @ts-ignore*/}
          <CommentTree comments={tree} />
        </Provider>
      </MemoryRouter>
    );
    const rootElements = wrapper.find('.root');
    const rootElement = rootElements.at(1);
    const childTree = rootElement.find('.child');
    expect(childTree.text()).toMatch(comments[2].text);
  });
});
