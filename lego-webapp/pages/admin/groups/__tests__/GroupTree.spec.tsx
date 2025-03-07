import { shallow } from 'enzyme';
import TreeView from 'react-treeview';
import { describe, it, expect } from 'vitest';
import GroupTree from '../GroupTree';

const groups = [
  {
    description: 'cool group',
    id: 1,
    name: 'Cat',
  },
  {
    description: 'bad group',
    id: 2,
    name: 'Dog',
    parent: 1,
  },
  {
    description: 'standalone group',
    id: 3,
    name: 'Bird',
  },
];
describe('<GroupTree />', () => {
  it('should render the child nodes as links', () => {
    const wrapper = shallow(
      <GroupTree groups={groups} pathname="/admin/groups/1/settings" />,
    );
    expect(
      wrapper.containsMatchingElement(
        <a href="/admin/groups/2/settings">Dog</a>,
      ),
    ).toBe(true);
    expect(
      wrapper.containsMatchingElement(
        <a href="/admin/groups/3/settings">Bird</a>,
      ),
    ).toBe(true);
  });
  it('should render the root nodes correctly', () => {
    const children = shallow(
      <GroupTree groups={groups} pathname="/admin/groups/1/settings" />,
    ).children();
    expect(children.at(1).is(TreeView)).toBe(true);
  });
  it('should work with only root groups', () => {
    const rootGroups = groups.slice(0, 1);
    const wrapper = shallow(
      <GroupTree groups={rootGroups} pathname="/admin/groups/1/settings" />,
    );
    const links = wrapper.find(Link);
    expect(wrapper.find(TreeView)).toHaveLength(0);
    expect(links).toHaveLength(1);
  });
  it('should preserve the selected tab', () => {
    const wrapper = shallow(
      <GroupTree
        groups={groups}
        pathname="/admin/groups/1/members?descendants=false"
      />,
    );
    expect(
      wrapper.containsMatchingElement(
        <a href="/admin/groups/2/members?descendants=false">Dog</a>,
      ),
    ).toBe(true);
    expect(
      wrapper.containsMatchingElement(
        <a href="/admin/groups/3/members?descendants=false">Bird</a>,
      ),
    ).toBe(true);
  });
});
