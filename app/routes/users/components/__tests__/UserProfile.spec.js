import React from 'react';
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
    const wrapper = shallow(<UserProfile user={user} showSettings />);
    expect(
      wrapper.containsMatchingElement(
        <Link to="/users/webkom/settings/profile">Innstillinger</Link>
      )
    ).toEqual(true);
  });

  it('should not show a settings link for other users', () => {
    const wrapper = shallow(<UserProfile user={user} showSettings={false} />);
    expect(
      wrapper.containsMatchingElement(
        <Link to="/users/webkom/settings/profile">Innstillinger</Link>
      )
    ).toEqual(false);
  });

  it('should render user info', () => {
    const wrapper = shallow(<UserProfile user={user} showSettings={false} />);
    expect(wrapper.containsMatchingElement(<h2>{user.fullName}</h2>)).toEqual(
      true
    );
    expect(wrapper.html()).toContain(user.email);
    expect(wrapper.html()).toContain(user.username);
  });
});
