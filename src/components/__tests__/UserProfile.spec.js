import React from 'react';
import expect from 'expect';
import LoadingIndicator from '../ui/LoadingIndicator';
import UserProfile from '../UserProfile';
import TestUtils from 'react-addons-test-utils';
import { Link } from 'react-router';

function setup(props = {}) {
  const renderer = TestUtils.createRenderer();
  renderer.render(<UserProfile {...props} />);
  const output = renderer.getRenderOutput();
  return { props, output, renderer };
}

const user = {
  id: 1,
  email: 'webkom@abakus.no',
  firstName: 'webkom',
  fullName: 'webkom webkom',
  isActive: true,
  isStaff: false,
  lastName: 'webkom',
  username: 'webkom'
};

describe('components', () => {
  describe('UserProfile', () => {
    it('should show a settings link if the user is me', () => {
      const { output } = setup({ user, isMe: true });
      expect(output).toIncludeJSX(<Link to='/users/me/settings'>Settings</Link>);
    });

    it('should not show a settings link for other users', () => {
      const { output } = setup({ user, isMe: false });
      expect(output).toNotIncludeJSX(<Link to='/users/me/settings'>Settings</Link>);
    });

    it('should show a LoadingIndicator while the user prop is loading', () => {
      const { output } = setup();
      expect(output.type).toBe(LoadingIndicator);
      expect(output.props.loading).toBe(true);
      expect(output.props.children).toNotExist();
    });

    it('should render user info', () => {
      const { output } = setup({ user, isMe: false });
      expect(output).toIncludeJSX(<h2>{user.fullName}</h2>);
      expect(output).toIncludeJSX(user.email);
      expect(output).toIncludeJSX(user.username);
    });
  });
});
