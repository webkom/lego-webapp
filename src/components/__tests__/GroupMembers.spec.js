import React from 'react';
import expect from 'expect';
import GroupMembers from '../GroupMembers';
import GroupMembersList from '../GroupMembersList';
import TestUtils from 'react-addons-test-utils';
import { Link } from 'react-router';
import { omit } from 'lodash';

function setupGroupMembers(props = {}) {
  const renderer = TestUtils.createRenderer();
  renderer.render(<GroupMembers {...props} />);
  const output = renderer.getRenderOutput();
  return { props, output, renderer };
}

function setupGroupMembersList(props = {}) {
  const renderer = TestUtils.createRenderer();
  renderer.render(<GroupMembersList {...props} />);
  const output = renderer.getRenderOutput();
  return { props, output, renderer };
}

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
      const { output } = setupGroupMembers({ group });
      const loadingIndicator = output.props.children[1];
      const members = loadingIndicator.props.children;
      expect(members.type).toBe(GroupMembersList);
      expect(members.props.users).toBe(users);
    });

    it('should not render the GroupMembersList component while loading', () => {
      const { output } = setupGroupMembers({ group: omit(group, 'users') });
      const loadingIndicator = output.props.children[1];
      expect(loadingIndicator.props.loading).toBe(true);
      expect(loadingIndicator.props.children).toNotExist();
    });
  });

  describe('GroupMembersList', () => {
    it('should render "No users" for an empty array', () => {
      const { output } = setupGroupMembersList({ users: [] });
      expect(output).toIncludeJSX('No users');
    });

    it('should render an <ul> of users', () => {
      const { output } = setupGroupMembersList({ users });
      const links = output.props.children;
      expect(output.type).toEqual('ul');
      expect(links.length).toEqual(users.length);
    });

    it('should include links for all users in the list', () => {
      const { output } = setupGroupMembersList({ users });
      users.forEach(({ username }, i) => {
        const link = output.props.children[i];
        expect(link.key).toEqual(username);
        expect(link).toIncludeJSX(<Link to={`/users/${username}`}>{username}</Link>);
      });
    });
  });
});
