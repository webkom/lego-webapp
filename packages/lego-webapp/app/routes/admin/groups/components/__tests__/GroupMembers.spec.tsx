import { shallow } from 'enzyme';
import { Link } from 'react-router';
import { describe, it, expect } from 'vitest';
import GroupMembersList from '../GroupMembersList';

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
      username: 'webkom',
    },
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
      username: 'plebkom',
    },
  },
];
describe.skip('GroupMembersList', () => {
  it('should render "No users" for an empty array', () => {
    const wrapper = shallow(<GroupMembersList memberships={[]} />);
    expect(wrapper.text()).toContain('Ingen brukere');
  });
  it('should render an <ul> of users', () => {
    const wrapper = shallow(<GroupMembersList memberships={memberships} />);
    expect(wrapper.type()).toBe('ul');
    expect(wrapper.find('li')).toHaveLength(memberships.length);
  });
  it('should include links for all users in the list', () => {
    const wrapper = shallow(<GroupMembersList memberships={memberships} />);
    const children = wrapper.children();
    memberships.forEach(({ user }) => {
      const expected = (
        <Link to={`/users/${user.username}`}>
          {user.fullName} ({user.username})
        </Link>
      );
      expect(children.containsMatchingElement(expected)).toBe(true);
    });
  });
});
