import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { describe, it, expect } from 'vitest';
import { generateTreeStructure } from 'app/utils';
import CommentTree from '../CommentTree';
import comments from './fixtures/comments';

const store = configureStore([])({
  theme: {
    theme: 'light',
  },
});

describe('<CommentTree />', () => {
  const tree = generateTreeStructure(comments);
  it('should render the top level comments at root level', () => {
    // eslint-disable-next-line
    // @ts-ignore
    const wrapper = shallow(<CommentTree comments={tree} />);
    const commentElements = wrapper.find('[data-ischild=false]');
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
      </MemoryRouter>,
    );
    const rootElements = wrapper.find('[data-ischild=false]');
    const rootElement = rootElements.at(1);
    const childTree = rootElement.find('[data-ischild=true]');
    expect(childTree.text()).toMatch(comments[2].text);
  });
});
