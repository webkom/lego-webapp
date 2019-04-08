import React from 'react';
import GroupTree from '../GroupTree';
import TreeView from 'react-treeview';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';

const groups = [
  {
    description: 'cool group',
    id: 1,
    name: 'Cat'
  },
  {
    description: 'bad group',
    id: 2,
    name: 'Dog',
    parent: 1
  },
  {
    description: 'standalone group',
    id: 3,
    name: 'Bird'
  }
];

describe('<GroupTree />', () => {
  it('should render the child nodes as links', () => {
    const wrapper = shallow(
      <GroupTree groups={groups} pathname="/admin/groups/1/settings" />
    );
    expect(
      wrapper.containsMatchingElement(
        <Link to="/admin/groups/2/settings">Dog</Link>
      )
    ).toEqual(true);

    expect(
      wrapper.containsMatchingElement(
        <Link to="/admin/groups/3/settings">Bird</Link>
      )
    ).toEqual(true);
  });

  it('should render the root nodes correctly', () => {
    const children = shallow(
      <GroupTree groups={groups} pathname="/admin/groups/1/settings" />
    ).children();
    expect(children.at(0).is(TreeView)).toEqual(true);
  });

  it('should work with only root groups', () => {
    const rootGroups = groups.slice(0, 1);
    const wrapper = shallow(
      <GroupTree groups={rootGroups} pathname="/admin/groups/1/settings" />
    );
    const links = wrapper.find(Link);
    expect(wrapper.find(TreeView).length).toEqual(0);
    expect(links.length).toEqual(1);
  });

  it('should preserve the selected tab', () => {
    const wrapper = shallow(
      <GroupTree groups={groups} pathname="/admin/groups/1/members" />
    );
    expect(
      wrapper.containsMatchingElement(
        <Link to="/admin/groups/2/members">Dog</Link>
      )
    ).toEqual(true);

    expect(
      wrapper.containsMatchingElement(
        <Link to="/admin/groups/3/members">Bird</Link>
      )
    ).toEqual(true);
  });
});
