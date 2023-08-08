import { Button } from '@webkom/lego-bricks';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import UserProfile from '../UserProfile';

const user = {
  id: 1,
  email: 'webkom@abakus.no',
  firstName: 'webkom',
  fullName: 'webkom webkom',
  isActive: true,
  isStaff: false,
  lastName: 'webkom',
  username: 'webkom',
};
describe('<UserProfile />', () => {
  it('should show a settings link if the user is me', () => {
    const wrapper = shallow(<UserProfile user={user} showSettings />);
    expect(
      wrapper.containsMatchingElement(
        <Link to="/users/webkom/settings/profile">
          <Button>Innstillinger</Button>
        </Link>
      )
    ).toBe(true);
  });
  it('should not show a settings link for other users', () => {
    const wrapper = shallow(<UserProfile user={user} showSettings={false} />);
    expect(
      wrapper.containsMatchingElement(
        <Link to="/users/webkom/settings/profile">
          <Button>Innstillinger</Button>
        </Link>
      )
    ).toBe(false);
  });
  it('should render user info', () => {
    const wrapper = shallow(<UserProfile user={user} showSettings={false} />);
    expect(wrapper.containsMatchingElement(<h2>{user.fullName}</h2>)).toBe(
      true
    );
  });
});
