import React from 'react';

import LoadingIndicator from 'app/components/LoadingIndicator';
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
      expect(wrapper.contains(<Link to='/users/me/settings'>Settings</Link>)).to.equal(true);
    });

    it('should not show a settings link for other users', () => {
      const wrapper = shallow(<UserProfile user={user} isMe={false} />);
      expect(wrapper.contains(<Link to='/users/me/settings'>Settings</Link>)).to.equal(false);
    });

    it('should show a LoadingIndicator while the user prop is loading', () => {
      const wrapper = shallow(<UserProfile />);
      expect(wrapper.is(LoadingIndicator)).to.equal(true);
      expect(wrapper.props().loading).to.equal(true);
      expect(wrapper.children().isEmpty()).to.equal(true);
    });

    it('should render user info', () => {
      const wrapper = shallow(<UserProfile user={user} isMe={false} />);
      expect(wrapper.contains(<h2>{user.fullName}</h2>)).to.equal(true);
      expect(wrapper.contains(user.email)).to.equal(true);
      expect(wrapper.contains(user.username)).to.equal(true);
    });
  });
});
