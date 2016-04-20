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
      expect(wrapper).to.contain(<Link to='/users/me/settings'>Settings</Link>);
    });

    it('should not show a settings link for other users', () => {
      const wrapper = shallow(<UserProfile user={user} isMe={false} />);
      expect(wrapper).to.not.contain(<Link to='/users/me/settings'>Settings</Link>);
    });

    it('should show a LoadingIndicator while the user prop is loading', () => {
      const wrapper = shallow(<UserProfile />);
      expect(wrapper.is(LoadingIndicator)).to.equal(true);

      expect(wrapper).to.have.prop('loading');
      expect(wrapper.children()).to.be.blank();
    });

    it('should render user info', () => {
      const wrapper = shallow(<UserProfile user={user} isMe={false} />);
      expect(wrapper).to.contain(<h2>{user.fullName}</h2>);
      expect(wrapper).to.contain(user.email);
      expect(wrapper).to.contain(user.username);
    });
  });
});
