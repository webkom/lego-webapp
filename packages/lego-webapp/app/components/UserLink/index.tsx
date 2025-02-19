import { Flex } from '@webkom/lego-bricks';
import { Link } from 'react-router';
import { ProfilePicture } from '../Image';
import type { UnknownUser } from 'app/store/models/User';

type UserLinkProps = {
  user: Pick<
    UnknownUser,
    'profilePicture' | 'username' | 'profilePicturePlaceholder' | 'fullName'
  >;
};

const UserLink = ({ user }: UserLinkProps) => {
  return (
    <Flex wrap alignItems="center" gap="var(--spacing-sm)">
      <ProfilePicture size={24} user={user} />
      <Link to={`/users/${user.username}`}>{user.fullName}</Link>
    </Flex>
  );
};

export default UserLink;
