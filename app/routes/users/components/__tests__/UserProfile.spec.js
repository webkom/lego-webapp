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

describe('<UserProfile />', () => {
  it('should show a settings link if the user is me', () => {
    const wrapper = shallow(<UserProfile user={user} isMe />);
    expect(wrapper.containsMatchingElement(
      <Link to='/users/me/settings'>Settings</Link>
    )).toEqual(true);
  });

  it('should not show a settings link for other users', () => {
    const wrapper = shallow(<UserProfile user={user} isMe={false} />);
    expect(wrapper.containsMatchingElement(
      <Link to='/users/me/settings'>Settings</Link>
    )).toEqual(false);
  });

  it('should show a LoadingIndicator while the user prop is loading', () => {
    const wrapper = shallow(<UserProfile />);
    expect(wrapper.is(LoadingIndicator)).toEqual(true);

    expect(wrapper.prop('loading')).toEqual(true);
    expect(wrapper.children().length).toEqual(0);
  });

  it('should render user info', () => {
    const wrapper = shallow(<UserProfile user={user} isMe={false} />);
    expect(wrapper.containsMatchingElement(<h2>{user.fullName}</h2>)).toEqual(true);
    expect(wrapper.html()).toContain(user.email);
    expect(wrapper.html()).toContain(user.username);
  });
});
