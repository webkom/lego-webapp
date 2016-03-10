import React from 'react';
import expect from 'expect';
import LoadingIndicator from '🏠/components/LoadingIndicator';
import UserProfile from '../UserProfile';
import { shallow } from 'enzyme';
import { Link } from 'react-router';

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
      const wrapper = shallow(<UserProfile user={user} isMe />);
      expect(wrapper.contains(<Link to='/users/me/settings'>Settings</Link>)).toBe(true);
    });

    it('should not show a settings link for other users', () => {
      const wrapper = shallow(<UserProfile user={user} isMe={false} />);
      expect(wrapper.contains(<Link to='/users/me/settings'>Settings</Link>)).toBe(false);
    });

    it('should show a LoadingIndicator while the user prop is loading', () => {
      const wrapper = shallow(<UserProfile />);
      expect(wrapper.is(LoadingIndicator)).toBe(true);
      expect(wrapper.props().loading).toBe(true);
      expect(wrapper.children().isEmpty()).toBe(true);
    });

    it('should render user info', () => {
      const wrapper = shallow(<UserProfile user={user} isMe={false} />);
      expect(wrapper.contains(<h2>{user.fullName}</h2>)).toBe(true);
      expect(wrapper.contains(user.email)).toBe(true);
      expect(wrapper.contains(user.username)).toBe(true);
    });
  });
});
