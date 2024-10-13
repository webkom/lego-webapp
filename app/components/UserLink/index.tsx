import { UnknownUser } from 'app/store/models/User';
import { ProfilePicture } from '../Image';
import { Link } from 'react-router-dom';
import { Flex } from '@webkom/lego-bricks';

type UserLinkProps = {
  user: Pick<
    UnknownUser,
    'profilePicture' | 'username' | 'profilePicturePlaceholder' | 'fullName'
  >;
};

const UserLink = ({ user }: UserLinkProps) => {
  return (
    <Flex alignItems="center" gap="var(--spacing-sm)">
      <ProfilePicture size={30} user={user} />
      <Link to={`/users/${user.username}`}>{user.fullName}</Link>
    </Flex>
  );
};

export default UserLink;
