import React from 'react';
import expect from 'expect';
import GroupMembers from '../GroupMembers';
import GroupMembersList from '../GroupMembersList';
import LoadingIndicator from '../ui/LoadingIndicator';
import { shallow } from 'enzyme';
import { Link } from 'react-router';
import { omit } from 'lodash';

const users = [
  {
    email: 'webkom@abakus.no',
    firstName: 'webkom',
    fullName: 'webkom webkom',
    id: 1,
    isActive: true,
    isStaff: false,
    lastName: 'webkom',
    username: 'webkom'
  },
  {
    email: 'plebkom@abakus.no',
    firstName: 'plebkom',
    fullName: 'plebkom plebkom',
    id: 2,
    isActive: true,
    isStaff: false,
    lastName: 'plebkom',
    username: 'plebkom'
  }
];

const group = {
  description: 'cool group',
  id: 1,
  name: 'Cat',
  permissions: [],
  users
};

describe('components', () => {
  describe('GroupMembers', () => {
    it('should render the GroupMembersList component with the user list', () => {
      const wrapper = shallow(<GroupMembers group={group} />);
      const membersList = wrapper.find(GroupMembersList);
      expect(membersList.props().users).toBe(users);
    });

    it('should not render the GroupMembersList component while loading', () => {
      const wrapper = shallow(<GroupMembers group={omit(group, 'users')} />);
      const loadingIndicator = wrapper.find(LoadingIndicator);
      const { loading, children } = loadingIndicator.props();
      expect(loading).toBe(true);
      expect(children).toNotExist();
    });
  });

  describe('GroupMembersList', () => {
    it('should render "No users" for an empty array', () => {
      const wrapper = shallow(<GroupMembersList users={[]} />);
      expect(wrapper.contains('No users')).toBe(true);
    });

    it('should render an <ul> of users', () => {
      const wrapper = shallow(<GroupMembersList users={users} />);
      expect(wrapper.type()).toEqual('ul');
      expect(wrapper.children().length).toEqual(users.length);
    });

    it('should include links for all users in the list', () => {
      const wrapper = shallow(<GroupMembersList users={users} />);
      const children = wrapper.children();
      users.forEach(({ username }, i) => {
        const link = <Link to={`/users/${username}`}>{username}</Link>;
        expect(children.at(i).contains(link)).toBe(true);
      });
    });
  });
});
