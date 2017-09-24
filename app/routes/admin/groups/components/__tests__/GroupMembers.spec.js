/* eslint-disable no-unused-expressions */
import React from 'react';
import GroupMembers from '../GroupMembers';
import GroupMembersList from '../GroupMembersList';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { shallow } from 'enzyme';
import { Link } from 'react-router';
import { omit } from 'lodash';

const memberships = [
  {
    id: 1,
    role: 'member',
    abakusGroup: 1,
    user: {
      email: 'webkom@abakus.no',
      firstName: 'webkom',
      fullName: 'webkom webkom',
      id: 1,
      isActive: true,
      isStaff: false,
      lastName: 'webkom',
      username: 'webkom'
    }
  },
  {
    id: 2,
    role: 'member',
    abakusGroup: 1,
    user: {
      email: 'plebkom@abakus.no',
      firstName: 'plebkom',
      fullName: 'plebkom plebkom',
      id: 2,
      isActive: true,
      isStaff: false,
      lastName: 'plebkom',
      username: 'plebkom'
    }
  }
];

const group = {
  description: 'cool group',
  id: 1,
  name: 'Cat',
  permissions: [],
  memberships
};

describe('<GroupMembers />', () => {
  it('should render the GroupMembersList component with the user list', () => {
    const wrapper = shallow(<GroupMembers group={group} />);
    const membersList = wrapper.find(GroupMembersList);
    expect(membersList.prop('memberships')).toEqual(memberships);
  });

  it('should not render the GroupMembersList component while loading', () => {
    const wrapper = shallow(
      <GroupMembers group={omit(group, 'memberships')} />
    );
    const loadingIndicator = wrapper.find(LoadingIndicator);
    const { loading } = loadingIndicator.props();
    expect(loading).toEqual(true);
  });
});

describe('GroupMembersList', () => {
  it('should render "No users" for an empty array', () => {
    const wrapper = shallow(<GroupMembersList memberships={[]} />);
    expect(wrapper.text()).toContain('Ingen brukere');
  });

  it('should render an <ul> of users', () => {
    const wrapper = shallow(<GroupMembersList memberships={memberships} />);
    expect(wrapper.type()).toEqual('ul');
    expect(wrapper.find('li').length).toEqual(memberships.length);
  });

  it('should include links for all users in the list', () => {
    const wrapper = shallow(<GroupMembersList memberships={memberships} />);
    const children = wrapper.children();
    memberships.forEach(({ user }, i) => {
      const expected = (
        <Link to={`/users/${user.username}`}>
          {user.fullName} ({user.username})
        </Link>
      );

      expect(children.containsMatchingElement(expected)).toEqual(true);
    });
  });
});
