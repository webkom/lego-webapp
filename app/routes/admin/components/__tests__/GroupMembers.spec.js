/* eslint-disable no-unused-expressions */
import React from 'react';

import GroupMembers from '../../GroupMembersRoute';
import GroupMembersList from '../GroupMembersList';
import LoadingIndicator from 'app/components/LoadingIndicator';
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
      expect(membersList.prop('users')).to.equal(users);
    });

    it('should not render the GroupMembersList component while loading', () => {
      const wrapper = shallow(<GroupMembers group={omit(group, 'users')} />);
      const loadingIndicator = wrapper.find(LoadingIndicator);
      const { loading, children } = loadingIndicator.props();
      expect(loading).to.equal(true);
      expect(children).to.not.exist;
    });
  });

  describe('GroupMembersList', () => {
    it('should render "No users" for an empty array', () => {
      const wrapper = shallow(<GroupMembersList users={[]} />);
      expect(wrapper).to.contain('No users');
    });

    it('should render an <ul> of users', () => {
      const wrapper = shallow(<GroupMembersList users={users} />);
      expect(wrapper).to.have.tagName('ul');
      expect(wrapper).to.have.exactly(users.length).descendants('li');
    });

    it('should include links for all users in the list', () => {
      const wrapper = shallow(<GroupMembersList users={users} />);
      const children = wrapper.children();
      users.forEach(({ username }, i) => {
        const link = <Link to={`/users/${username}`}>{username}</Link>;
        expect(children.at(i)).to.contain(link);
      });
    });
  });
});
